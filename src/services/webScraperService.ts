
// This is a mock service to simulate fetching data from a website
// In a real application, this would likely be an API or a serverless function

import { LoginCredentials, Partner, Transaction } from "@/types/partner";
import { toast } from "@/hooks/use-toast";

// Simulate fetching partners from a website
export const fetchPartnersFromWebsite = async (credentials: LoginCredentials): Promise<Partner[] | null> => {
  console.info('Buscando parceiros do site com credenciais:', credentials);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock data
  const mockPartners: Partner[] = [
    {
      id: '1',
      name: 'Tayna',
      username: '@tayna',
      commission: 10,
      bonus: 50,
      transactions: [],
      clients: [], // Add empty clients array
      active: true
    },
    {
      id: '2',
      name: 'Raquel',
      username: '@raquel',
      commission: 8,
      bonus: 75,
      transactions: [],
      clients: [], // Add empty clients array
      active: true
    },
    {
      id: '3',
      name: 'Carlos',
      username: '@carlos',
      commission: 12,
      bonus: 100,
      transactions: [],
      clients: [], // Add empty clients array
      active: true
    },
    {
      id: '4',
      name: 'Inativo',
      username: '@inativo',
      commission: 5,
      bonus: 0,
      transactions: [],
      clients: [], // Add empty clients array
      active: false
    },
    {
      id: '5',
      name: 'Novo',
      username: '@novo',
      commission: 7,
      bonus: 25,
      transactions: [],
      clients: [], // Add empty clients array
      active: true
    }
  ];
  
  return mockPartners;
};

// Fetch transactions for a specific partner
export const fetchPartnerTransactions = async (partner: Partner, credentials: LoginCredentials): Promise<Transaction[] | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock data
  const mockTransactions: Transaction[] = [
    { 
      id: `${partner.id}-1`, 
      partnerId: partner.id, 
      date: new Date().toISOString().split('T')[0], 
      amount: 500, 
      type: 'entrada', 
      description: 'Depósito Cliente A',
      clientName: 'Cliente A',
      clientLogin: '@clienteA',
      time: '10:30',
      method: 'PIX'
    },
    { 
      id: `${partner.id}-2`, 
      partnerId: partner.id, 
      date: new Date().toISOString().split('T')[0], 
      amount: 200, 
      type: 'saida', 
      description: 'Saque Cliente A',
      clientName: 'Cliente A',
      clientLogin: '@clienteA',
      time: '14:15',
      method: 'PIX'
    },
    { 
      id: `${partner.id}-3`, 
      partnerId: partner.id, 
      date: new Date().toISOString().split('T')[0], 
      amount: 300, 
      type: 'entrada', 
      description: 'Depósito Cliente B',
      clientName: 'Cliente B',
      clientLogin: '@clienteB',
      time: '16:45',
      method: 'PIX'
    }
  ];
  
  return mockTransactions;
};

// Download CSV for a partner
export const downloadCSV = async (partner: Partner, credentials: LoginCredentials): Promise<string | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock CSV content
    const headers = 'data,hora,cliente,login,descricao,valor,tipo,metodo';
    const rows = [
      `${new Date().toISOString().split('T')[0]},10:30,"Cliente A","@clienteA","Depósito",500.00,entrada,PIX`,
      `${new Date().toISOString().split('T')[0]},14:15,"Cliente A","@clienteA","Saque",200.00,saida,PIX`,
      `${new Date().toISOString().split('T')[0]},16:45,"Cliente B","@clienteB","Depósito",300.00,entrada,PIX`,
      `${new Date().toISOString().split('T')[0]},18:20,"Cliente C","@clienteC","Depósito",750.00,entrada,PIX`,
      `${new Date().toISOString().split('T')[0]},20:10,"Cliente C","@clienteC","Saque",50.00,saida,PIX`
    ];
    
    const csvContent = `${headers}\n${rows.join('\n')}`;
    
    return csvContent;
  } catch (error) {
    console.error('Error downloading CSV:', error);
    
    toast({
      title: "Erro ao baixar CSV",
      description: "Não foi possível baixar o arquivo CSV do site.",
      variant: "destructive",
    });
    
    return null;
  }
};
