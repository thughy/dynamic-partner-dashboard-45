
// This is a mock service to simulate fetching data from a website
// In a real application, this would likely be an API or a serverless function

import { LoginCredentials, Partner, Transaction } from "@/types/partner";
import { toast } from "@/hooks/use-toast";
import { startOfWeek, endOfWeek, format, addDays } from "date-fns";

// Generate dates for the current week (Monday to Sunday)
const getCurrentWeekDates = () => {
  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
  const sunday = addDays(monday, 6); // Sunday is 6 days after Monday
  
  return {
    monday,
    sunday,
    dates: Array(7).fill(0).map((_, i) => format(addDays(monday, i), 'yyyy-MM-dd'))
  };
};

// Simulate fetching partners from Virtual Club website
export const fetchPartnersFromWebsite = async (credentials: LoginCredentials): Promise<Partner[] | null> => {
  console.info('Buscando parceiros do site Virtual Club com credenciais:', credentials);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock data that better resembles Virtual Club
  const mockPartners: Partner[] = [
    {
      id: '1',
      name: 'João Carlos',
      username: '@joaocarlos',
      commission: 8,
      bonus: 50,
      transactions: [],
      clients: [],
      active: true
    },
    {
      id: '2',
      name: 'Ana Beatriz',
      username: '@anabeatriz',
      commission: 10,
      bonus: 100,
      transactions: [],
      clients: [],
      active: true
    },
    {
      id: '3',
      name: 'Ricardo Souza',
      username: '@ricardosouza',
      commission: 12,
      bonus: 150,
      transactions: [],
      clients: [],
      active: true
    },
    {
      id: '4',
      name: 'Isabela Mendes',
      username: '@isabelamendes',
      commission: 9,
      bonus: 75,
      transactions: [],
      clients: [],
      active: true
    },
    {
      id: '5',
      name: 'Marcos Oliveira',
      username: '@marcosoliveira',
      commission: 7,
      bonus: 50,
      transactions: [],
      clients: [],
      active: false
    }
  ];
  
  return mockPartners;
};

// Fetch transactions for a specific partner
export const fetchPartnerTransactions = async (partner: Partner, credentials: LoginCredentials): Promise<Transaction[] | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const { dates } = getCurrentWeekDates();
  console.log(`Fetching transactions for ${partner.username} for current week`);
  
  // Generate more realistic transactions across the current week (Monday to Sunday)
  const mockTransactions: Transaction[] = [];
  
  // Sample client names for Virtual Club
  const clients = [
    { name: 'Carlos Eduardo', login: '@carloseduardo' },
    { name: 'Fernanda Silva', login: '@fernandasilva' },
    { name: 'Gabriel Santos', login: '@gabrielsantos' },
    { name: 'Patricia Costa', login: '@patriciacosta' },
    { name: 'Henrique Lima', login: '@henriquelima' }
  ];
  
  // Generate 2-3 transactions per day
  dates.forEach((date, index) => {
    // Number of transactions for this day (randomly 1-3)
    const transactionsPerDay = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < transactionsPerDay; i++) {
      // Random client
      const client = clients[Math.floor(Math.random() * clients.length)];
      
      // Random hour (9-22)
      const hour = Math.floor(Math.random() * 14) + 9;
      const minute = Math.floor(Math.random() * 60);
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Generate transaction
      const isDeposit = Math.random() > 0.3; // 70% chance of deposit
      const amount = Math.floor(Math.random() * 1500) + 100; // Random amount between 100-1600
      
      mockTransactions.push({ 
        id: `${partner.id}-${date}-${i}`, 
        partnerId: partner.id, 
        date, 
        amount, 
        type: isDeposit ? 'entrada' : 'saida', 
        description: isDeposit ? 'Depósito' : 'Saque',
        clientName: client.name,
        clientLogin: client.login,
        time: timeString,
        method: 'PIX'
      });
    }
  });
  
  return mockTransactions;
};

// Download CSV for a partner
export const downloadCSV = async (partner: Partner, credentials: LoginCredentials): Promise<string | null> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { dates } = getCurrentWeekDates();
    console.log(`Downloading CSV for ${partner.username} for current week`);
    
    // Generate mock CSV content with dates from the current week (Monday to Sunday)
    const headers = 'data,hora,cliente,login,descricao,valor,tipo,metodo';
    let rows: string[] = [];
    
    // Sample client names
    const clients = [
      { name: 'Carlos Eduardo', login: '@carloseduardo' },
      { name: 'Fernanda Silva', login: '@fernandasilva' },
      { name: 'Gabriel Santos', login: '@gabrielsantos' },
      { name: 'Patricia Costa', login: '@patriciacosta' },
      { name: 'Henrique Lima', login: '@henriquelima' }
    ];
    
    // Generate 2-3 transactions per day
    dates.forEach(date => {
      // Number of transactions for this day (randomly 1-3)
      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < transactionsPerDay; i++) {
        // Random client
        const client = clients[Math.floor(Math.random() * clients.length)];
        
        // Random hour (9-22)
        const hour = Math.floor(Math.random() * 14) + 9;
        const minute = Math.floor(Math.random() * 60);
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Generate transaction
        const isDeposit = Math.random() > 0.3; // 70% chance of deposit
        const amount = Math.floor(Math.random() * 1500) + 100; // Random amount between 100-1600
        
        rows.push(`${date},${timeString},"${client.name}","${client.login}","${isDeposit ? 'Depósito' : 'Saque'}",${amount.toFixed(2)},${isDeposit ? 'entrada' : 'saida'},PIX`);
      }
    });
    
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
