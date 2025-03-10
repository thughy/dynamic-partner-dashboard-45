
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Partner, Transaction, PartnerSummary } from '@/types/partner';
import { calculatePartnerSummary, calculateTotalSummary, parseCSVData } from '@/services/partnerService';
import { useToast } from '@/hooks/use-toast';

type PartnerContextType = {
  partners: Partner[];
  selectedPartnerId: string | null;
  setSelectedPartnerId: (id: string | null) => void;
  addPartner: (partner: Partner) => void;
  updatePartner: (updatedPartner: Partner) => void;
  deletePartner: (id: string) => void;
  importCSVForPartner: (partnerId: string, csvContent: string) => void;
  getPartnerSummary: (partnerId: string) => PartnerSummary | null;
  getAllPartnerSummaries: () => PartnerSummary[];
  getTotalSummary: () => any;
};

const PartnerContext = createContext<PartnerContextType | null>(null);

export const PartnerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
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

  return (
    <PartnerContext.Provider
      value={{
        partners,
        selectedPartnerId,
        setSelectedPartnerId,
        addPartner,
        updatePartner,
        deletePartner,
        importCSVForPartner,
        getPartnerSummary,
        getAllPartnerSummaries,
        getTotalSummary
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
