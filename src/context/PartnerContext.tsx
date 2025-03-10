
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Partner, Transaction, PartnerSummary, LoginCredentials, SyncStatus } from '@/types/partner';
import { calculatePartnerSummary, calculateTotalSummary, parseCSVData } from '@/services/partnerService';
import { fetchPartnersFromWebsite, fetchPartnerTransactions, downloadCSV } from '@/services/webScraperService';
import { syncWithGoogleSheets, fetchDataFromGoogleSheets, getLastSyncTime } from '@/services/googleSheetsService';
import { login, logout, isAuthenticated } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

type PartnerContextType = {
  partners: Partner[];
  selectedPartnerId: string | null;
  syncStatus: SyncStatus;
  isLoggedIn: boolean;
  setSelectedPartnerId: (id: string | null) => void;
  addPartner: (partner: Partner) => void;
  updatePartner: (updatedPartner: Partner) => void;
  deletePartner: (id: string) => void;
  importCSVForPartner: (partnerId: string, csvContent: string) => void;
  getPartnerSummary: (partnerId: string) => PartnerSummary | null;
  getAllPartnerSummaries: () => PartnerSummary[];
  getTotalSummary: () => any;
  loginToWebsite: (credentials: LoginCredentials) => Promise<boolean>;
  logoutFromWebsite: () => void;
  syncWithGoogleSheets: () => Promise<boolean>;
  refreshPartnersFromGoogleSheets: () => Promise<void>;
  importPartnersFromWebsite: (credentials: LoginCredentials) => Promise<void>;
  downloadPartnerCSV: (partnerId: string, credentials: LoginCredentials) => Promise<void>;
  downloadAllPartnersCSV: (credentials: LoginCredentials) => Promise<void>;
  getLastSyncTime: () => string | null;
};

const PartnerContext = createContext<PartnerContextType | null>(null);

export const PartnerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: '',
    status: 'idle'
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { toast } = useToast();

  // Load partners from localStorage on mount
  useEffect(() => {
    const savedPartners = localStorage.getItem('partners');
    if (savedPartners) {
      try {
        setPartners(JSON.parse(savedPartners));
      } catch (error) {
        console.error('Failed to parse partners from localStorage:', error);
      }
    }
    
    // Check authentication status
    setIsLoggedIn(isAuthenticated());
    
    // Load last sync time
    const lastSync = getLastSyncTime();
    if (lastSync) {
      setSyncStatus({
        lastSync,
        status: 'idle'
      });
    }
  }, []);

  // Save partners to localStorage on change
  useEffect(() => {
    localStorage.setItem('partners', JSON.stringify(partners));
  }, [partners]);

  const addPartner = (partner: Partner) => {
    // Check if partner with this username already exists
    if (partners.some(p => p.username === partner.username)) {
      toast({
        title: "Erro",
        description: `Parceiro com username ${partner.username} já existe.`,
        variant: "destructive",
      });
      return;
    }
    
    setPartners(prev => [...prev, partner]);
    toast({
      title: "Sucesso",
      description: `Parceiro ${partner.name} adicionado com sucesso.`,
    });
  };

  const updatePartner = (updatedPartner: Partner) => {
    setPartners(prev => 
      prev.map(partner => 
        partner.id === updatedPartner.id ? updatedPartner : partner
      )
    );
    toast({
      title: "Sucesso",
      description: `Parceiro ${updatedPartner.name} atualizado com sucesso.`,
    });
  };

  const deletePartner = (id: string) => {
    const partnerToDelete = partners.find(p => p.id === id);
    setPartners(prev => prev.filter(partner => partner.id !== id));
    
    if (selectedPartnerId === id) {
      setSelectedPartnerId(null);
    }
    
    toast({
      title: "Parceiro Removido",
      description: `Parceiro ${partnerToDelete?.name || ''} foi removido com sucesso.`,
    });
  };

  const importCSVForPartner = (partnerId: string, csvContent: string) => {
    try {
      const transactions = parseCSVData(csvContent, partnerId);
      
      setPartners(prev => 
        prev.map(partner => {
          if (partner.id === partnerId) {
            // Add new transactions to the partner
            return {
              ...partner,
              transactions: [...partner.transactions, ...transactions]
            };
          }
          return partner;
        })
      );
      
      toast({
        title: "Importação Concluída",
        description: `${transactions.length} transações importadas com sucesso.`,
      });
    } catch (error) {
      console.error('Error importing CSV:', error);
      toast({
        title: "Erro na Importação",
        description: "Falha ao importar o arquivo CSV. Verifique o formato.",
        variant: "destructive",
      });
    }
  };

  const getPartnerSummary = (partnerId: string): PartnerSummary | null => {
    const partner = partners.find(p => p.id === partnerId);
    if (!partner) return null;
    
    return calculatePartnerSummary(partner);
  };

  const getAllPartnerSummaries = (): PartnerSummary[] => {
    return partners.map(partner => calculatePartnerSummary(partner));
  };

  const getTotalSummary = () => {
    return calculateTotalSummary(partners);
  };

  // New methods for website integration
  const loginToWebsite = async (credentials: LoginCredentials): Promise<boolean> => {
    setSyncStatus({ ...syncStatus, status: 'syncing', message: 'Autenticando no site...' });
    
    const success = await login(credentials);
    setIsLoggedIn(success);
    
    setSyncStatus({ 
      ...syncStatus, 
      status: success ? 'success' : 'error',
      message: success ? 'Autenticado com sucesso' : 'Falha na autenticação'
    });
    
    return success;
  };

  const logoutFromWebsite = () => {
    logout();
    setIsLoggedIn(false);
    
    setSyncStatus({
      ...syncStatus,
      status: 'idle',
      message: 'Desconectado do site'
    });
  };

  const syncWithGoogleSheetsData = async (): Promise<boolean> => {
    setSyncStatus({ ...syncStatus, status: 'syncing', message: 'Sincronizando com Google Sheets...' });
    
    const success = await syncWithGoogleSheets(partners);
    
    setSyncStatus({ 
      lastSync: new Date().toISOString(),
      status: success ? 'success' : 'error',
      message: success ? 'Sincronizado com sucesso' : 'Falha na sincronização'
    });
    
    return success;
  };

  const refreshPartnersFromGoogleSheets = async (): Promise<void> => {
    setSyncStatus({ ...syncStatus, status: 'syncing', message: 'Atualizando dados do Google Sheets...' });
    
    const fetchedPartners = await fetchDataFromGoogleSheets();
    
    if (fetchedPartners) {
      setPartners(fetchedPartners);
      
      setSyncStatus({
        lastSync: new Date().toISOString(),
        status: 'success',
        message: 'Dados atualizados com sucesso'
      });
    } else {
      setSyncStatus({
        ...syncStatus,
        status: 'error',
        message: 'Falha ao atualizar dados do Google Sheets'
      });
    }
  };

  const importPartnersFromWebsite = async (credentials: LoginCredentials): Promise<void> => {
    setSyncStatus({ ...syncStatus, status: 'syncing', message: 'Importando parceiros do site...' });
    
    const fetchedPartners = await fetchPartnersFromWebsite(credentials);
    
    if (fetchedPartners) {
      // Merge with existing partners or replace entirely
      const mergedPartners = [...partners];
      
      fetchedPartners.forEach(newPartner => {
        const existingPartnerIndex = partners.findIndex(p => p.username === newPartner.username);
        
        if (existingPartnerIndex >= 0) {
          // Update existing partner
          mergedPartners[existingPartnerIndex] = {
            ...partners[existingPartnerIndex],
            name: newPartner.name,
            commission: newPartner.commission,
            bonus: newPartner.bonus
          };
        } else {
          // Add new partner
          mergedPartners.push(newPartner);
        }
      });
      
      setPartners(mergedPartners);
      
      setSyncStatus({
        lastSync: new Date().toISOString(),
        status: 'success',
        message: 'Parceiros importados com sucesso'
      });
    } else {
      setSyncStatus({
        ...syncStatus,
        status: 'error',
        message: 'Falha ao importar parceiros'
      });
    }
  };

  const downloadPartnerCSV = async (partnerId: string, credentials: LoginCredentials): Promise<void> => {
    const partner = partners.find(p => p.id === partnerId);
    if (!partner) {
      toast({
        title: "Erro",
        description: "Parceiro não encontrado",
        variant: "destructive",
      });
      return;
    }
    
    setSyncStatus({ ...syncStatus, status: 'syncing', message: `Baixando transações para ${partner.username}...` });
    
    const csvContent = await downloadCSV(partner, credentials);
    
    if (csvContent) {
      // Parse the CSV and update the partner's transactions
      const transactions = parseCSVData(csvContent, partnerId);
      
      setPartners(prev => 
        prev.map(p => {
          if (p.id === partnerId) {
            return {
              ...p,
              transactions: [...p.transactions, ...transactions]
            };
          }
          return p;
        })
      );
      
      setSyncStatus({
        lastSync: new Date().toISOString(),
        status: 'success',
        message: `Transações para ${partner.username} importadas com sucesso`
      });
    } else {
      setSyncStatus({
        ...syncStatus,
        status: 'error',
        message: `Falha ao baixar transações para ${partner.username}`
      });
    }
  };

  const downloadAllPartnersCSV = async (credentials: LoginCredentials): Promise<void> => {
    setSyncStatus({ ...syncStatus, status: 'syncing', message: 'Baixando transações para todos parceiros...' });
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const partner of partners) {
      const csvContent = await downloadCSV(partner, credentials);
      
      if (csvContent) {
        // Parse the CSV and update the partner's transactions
        const transactions = parseCSVData(csvContent, partner.id);
        
        setPartners(prev => 
          prev.map(p => {
            if (p.id === partner.id) {
              return {
                ...p,
                transactions: [...p.transactions, ...transactions]
              };
            }
            return p;
          })
        );
        
        successCount++;
      } else {
        errorCount++;
      }
    }
    
    if (errorCount === 0) {
      setSyncStatus({
        lastSync: new Date().toISOString(),
        status: 'success',
        message: `Transações para ${successCount} parceiros importadas com sucesso`
      });
    } else {
      setSyncStatus({
        lastSync: new Date().toISOString(),
        status: 'error',
        message: `Sucesso: ${successCount}, Falhas: ${errorCount}`
      });
    }
  };

  return (
    <PartnerContext.Provider
      value={{
        partners,
        selectedPartnerId,
        syncStatus,
        isLoggedIn,
        setSelectedPartnerId,
        addPartner,
        updatePartner,
        deletePartner,
        importCSVForPartner,
        getPartnerSummary,
        getAllPartnerSummaries,
        getTotalSummary,
        loginToWebsite,
        logoutFromWebsite,
        syncWithGoogleSheets: syncWithGoogleSheetsData,
        refreshPartnersFromGoogleSheets,
        importPartnersFromWebsite,
        downloadPartnerCSV,
        downloadAllPartnersCSV,
        getLastSyncTime
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartners = () => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error('usePartners must be used within a PartnerProvider');
  }
  return context;
};
