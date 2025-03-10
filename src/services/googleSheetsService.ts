
import { Transaction, Partner, GoogleSheetsConfig } from '@/types/partner';
import { toast } from '@/hooks/use-toast';

// Mock Google Sheets config for demonstration
const DEFAULT_SHEETS_CONFIG: GoogleSheetsConfig = {
  spreadsheetId: '1example-spreadsheet-id',
  sheetId: 0
};

// Note: In a real application, we would use the Google Sheets API
// This is a simulated implementation for demonstration purposes

export const initGoogleSheetsConfig = (): GoogleSheetsConfig => {
  const config = localStorage.getItem('googleSheetsConfig');
  if (config) {
    return JSON.parse(config);
  }
  return DEFAULT_SHEETS_CONFIG;
};

export const updateGoogleSheetsConfig = (config: GoogleSheetsConfig): void => {
  localStorage.setItem('googleSheetsConfig', JSON.stringify(config));
  
  toast({
    title: "Configuração atualizada",
    description: "Configuração do Google Sheets atualizada com sucesso.",
  });
};

export const syncWithGoogleSheets = async (partners: Partner[]): Promise<boolean> => {
  try {
    // Simulate API call to Google Sheets
    console.log('Syncing partners with Google Sheets:', partners);
    
    // In a real implementation, this would be an actual API call to Google Sheets
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update last sync time
    localStorage.setItem('lastSyncTime', new Date().toISOString());
    
    toast({
      title: "Sincronização concluída",
      description: "Dados sincronizados com o Google Sheets com sucesso.",
    });
    
    return true;
  } catch (error) {
    console.error('Error syncing with Google Sheets:', error);
    
    toast({
      title: "Erro na sincronização",
      description: "Ocorreu um erro ao sincronizar dados com o Google Sheets.",
      variant: "destructive",
    });
    
    return false;
  }
};

export const fetchDataFromGoogleSheets = async (): Promise<Partner[] | null> => {
  try {
    // Simulate API call to Google Sheets
    console.log('Fetching data from Google Sheets');
    
    // In a real implementation, this would be an actual API call to Google Sheets
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data for demonstration
    const mockPartners: Partner[] = [
      {
        id: '1',
        name: 'Tayna',
        username: '@tayna',
        commission: 10,
        bonus: 50,
        transactions: [
          { id: '1-1', partnerId: '1', date: '2023-10-15', amount: 500, type: 'entrada', description: 'Depósito Cliente A' },
          { id: '1-2', partnerId: '1', date: '2023-10-16', amount: 200, type: 'saida', description: 'Saque' },
          { id: '1-3', partnerId: '1', date: '2023-10-17', amount: 750, type: 'entrada', description: 'Depósito Cliente B' }
        ]
      },
      {
        id: '2',
        name: 'Raquel',
        username: '@raquel',
        commission: 8,
        bonus: 75,
        transactions: [
          { id: '2-1', partnerId: '2', date: '2023-10-15', amount: 600, type: 'entrada', description: 'Depósito Cliente C' },
          { id: '2-2', partnerId: '2', date: '2023-10-16', amount: 150, type: 'saida', description: 'Saque' },
        ]
      }
    ];
    
    // Update last sync time
    localStorage.setItem('lastSyncTime', new Date().toISOString());
    
    toast({
      title: "Dados atualizados",
      description: "Dados dos parceiros atualizados do Google Sheets.",
    });
    
    return mockPartners;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    
    toast({
      title: "Erro ao atualizar dados",
      description: "Ocorreu um erro ao buscar dados do Google Sheets.",
      variant: "destructive",
    });
    
    return null;
  }
};

export const getLastSyncTime = (): string | null => {
  return localStorage.getItem('lastSyncTime');
};
