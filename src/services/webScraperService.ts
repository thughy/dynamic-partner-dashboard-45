
// This is a mock service to simulate fetching data from a website
// In a real application, this would likely be an API or a serverless function

import { LoginCredentials, Partner, Transaction } from "@/types/partner";
import { toast } from "@/hooks/use-toast";
import { startOfWeek, endOfWeek, format } from "date-fns";

// Simulate fetching partners from a website
export const fetchPartnersFromWebsite = async (credentials: LoginCredentials): Promise<Partner[] | null> => {
  console.info('Buscando parceiros do site Virtual Club com credenciais:', credentials);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock data more aligned with Virtual Club
  const mockPartners: Partner[] = [
    {
      id: '1',
      name: 'Roberto Silva',
      username: '@roberto',
      commission: 10,
      bonus: 100,
      transactions: [],
      clients: [],
      active: true
    },
    {
      id: '2',
      name: 'Marcela Santos',
      username: '@marcela',
      commission: 12,
      bonus: 150,
      transactions: [],
      clients: [],
      active: true
    },
    {
      id: '3',
      name: 'Paulo Mendes',
      username: '@paulo',
      commission: 8,
      bonus: 75,
      transactions: [],
      clients: [],
      active: true
    },
    {
      id: '4',
      name: 'Fernanda Costa',
      username: '@fernanda',
      commission: 15,
      bonus: 200,
      transactions: [],
      clients: [],
      active: true
    },
    {
      id: '5',
      name: 'Lucas Oliveira',
      username: '@lucas',
      commission: 7,
      bonus: 50,
      transactions: [],
      clients: [],
      active: false
    }
  ];
  
  return mockPartners;
};

// Get current week dates (Monday to Sunday)
const getCurrentWeekDates = () => {
  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const sunday = endOfWeek(monday, { weekStartsOn: 1 });
  
  return {
    monday: format(monday, 'yyyy-MM-dd'),
    sunday: format(sunday, 'yyyy-MM-dd')
  };
};

// Fetch transactions for a specific partner
export const fetchPartnerTransactions = async (partner: Partner, credentials: LoginCredentials): Promise<Transaction[] | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const { monday, sunday } = getCurrentWeekDates();
  console.log(`Fetching transactions for ${partner.username} from ${monday} to ${sunday}`);
  
  // Mock data with realistic client names and more varied transactions
  const mockTransactions: Transaction[] = [
    { 
      id: `${partner.id}-1`, 
      partnerId: partner.id, 
      date: monday, 
      amount: 1200, 
      type: 'entrada', 
      description: 'Depósito',
      clientName: 'João Almeida',
      clientLogin: '@joao_almeida',
      time: '09:15',
      method: 'PIX'
    },
    { 
      id: `${partner.id}-2`, 
      partnerId: partner.id, 
      date: monday, 
      amount: 350, 
      type: 'saida', 
      description: 'Saque',
      clientName: 'João Almeida',
      clientLogin: '@joao_almeida',
      time: '14:30',
      method: 'PIX'
    },
    { 
      id: `${partner.id}-3`, 
      partnerId: partner.id, 
      date: format(new Date(monday), 'yyyy-MM-dd'), 
      amount: 800, 
      type: 'entrada', 
      description: 'Depósito',
      clientName: 'Maria Santos',
      clientLogin: '@maria_santos',
      time: '16:20',
      method: 'PIX'
    },
    { 
      id: `${partner.id}-4`, 
      partnerId: partner.id, 
      date: sunday, 
      amount: 1500, 
      type: 'entrada', 
      description: 'Depósito',
      clientName: 'Pedro Gomes',
      clientLogin: '@pedro_gomes',
      time: '10:45',
      method: 'PIX'
    },
    { 
      id: `${partner.id}-5`, 
      partnerId: partner.id, 
      date: sunday, 
      amount: 700, 
      type: 'saida', 
      description: 'Saque',
      clientName: 'Pedro Gomes',
      clientLogin: '@pedro_gomes',
      time: '18:30',
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
    
    const { monday, sunday } = getCurrentWeekDates();
    console.log(`Downloading CSV for ${partner.username} from ${monday} to ${sunday}`);
    
    // Generate mock CSV content with dates from the current week (Monday to Sunday)
    const headers = 'data,hora,cliente,login,descricao,valor,tipo,metodo';
    const rows = [
      `${monday},09:15,"João Almeida","@joao_almeida","Depósito",1200.00,entrada,PIX`,
      `${monday},14:30,"João Almeida","@joao_almeida","Saque",350.00,saida,PIX`,
      `${monday},16:20,"Maria Santos","@maria_santos","Depósito",800.00,entrada,PIX`,
      `${format(new Date(monday), 'yyyy-MM-dd')},11:05,"Carlos Ferreira","@carlos_ferreira","Depósito",950.00,entrada,PIX`,
      `${format(new Date(monday), 'yyyy-MM-dd')},17:40,"Carlos Ferreira","@carlos_ferreira","Saque",200.00,saida,PIX`,
      `${sunday},10:45,"Pedro Gomes","@pedro_gomes","Depósito",1500.00,entrada,PIX`,
      `${sunday},18:30,"Pedro Gomes","@pedro_gomes","Saque",700.00,saida,PIX`
    ];
    
    const csvContent = `${headers}\n${rows.join('\n')}`;
    
    toast({
      title: "Download concluído",
      description: `Dados do parceiro ${partner.name} baixados com sucesso`,
    });
    
    return csvContent;
  } catch (error) {
    console.error('Error downloading CSV:', error);
    
    toast({
      title: "Erro ao baixar CSV",
      description: "Não foi possível baixar o arquivo CSV do site Virtual Club.",
      variant: "destructive",
    });
    
    return null;
  }
};
