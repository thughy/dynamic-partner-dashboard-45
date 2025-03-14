
import { Partner, Transaction, PartnerSummary, Client } from '@/types/partner';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

// Função para obter transações da semana atual (segunda a domingo)
export const getCurrentWeekTransactions = (transactions: Transaction[]): Transaction[] => {
  const today = new Date();
  const mondayOfWeek = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday
  const sundayOfWeek = endOfWeek(today, { weekStartsOn: 1 });
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return isWithinInterval(transactionDate, { start: mondayOfWeek, end: sundayOfWeek });
  });
};

// Função para calcular o resumo do parceiro com base na semana atual
export const calculatePartnerSummary = (partner: Partner): PartnerSummary => {
  const currentWeekTransactions = getCurrentWeekTransactions(partner.transactions);
  
  const totalIn = currentWeekTransactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalOut = currentWeekTransactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const commissionValue = totalIn * (partner.commission / 100);
  const finalBalance = totalIn - totalOut - commissionValue + partner.bonus;
  
  // Contar clientes únicos
  const uniqueClients = new Set();
  currentWeekTransactions.forEach(t => {
    if (t.clientName) {
      uniqueClients.add(t.clientName);
    }
  });

  return {
    id: partner.id,
    name: partner.name,
    username: partner.username,
    totalIn,
    totalOut,
    commission: partner.commission,
    commissionValue,
    bonus: partner.bonus,
    finalBalance,
    clientCount: uniqueClients.size,
    transactionCount: currentWeekTransactions.length
  };
};

// Função para analisar dados CSV
export const parseCSVData = (csvText: string, partnerId: string): Transaction[] => {
  const lines = csvText.trim().split('\n');
  
  // Pular linha de cabeçalho
  const dataRows = lines.slice(1);
  
  return dataRows.map((row, index) => {
    const columns = row.split(',');
    
    // Assumindo formato CSV: date, time, client, client_login, description, amount, type, method
    return {
      id: `${partnerId}-${index}`,
      partnerId,
      date: columns[0]?.trim() || "",
      time: columns[1]?.trim() || undefined,
      clientName: columns[2]?.trim().replace(/"/g, '') || undefined,
      clientLogin: columns[3]?.trim().replace(/"/g, '') || undefined,
      description: columns[4]?.trim().replace(/"/g, '') || columns[1]?.trim().replace(/"/g, ''),
      amount: parseFloat(columns[5]?.trim().replace(/[^0-9.-]+/g, '') || columns[2]?.trim().replace(/[^0-9.-]+/g, '')),
      type: (columns[6]?.trim().toLowerCase() || columns[3]?.trim().toLowerCase()).includes('entrada') ? 'entrada' : 'saida',
      method: columns[7]?.trim().replace(/"/g, '') || undefined
    };
  });
};

// Função para analisar dados CSV de clientes
export const parseClientCSVData = (csvText: string, partnerId: string): Client[] => {
  const lines = csvText.trim().split('\n');
  
  // Pular linha de cabeçalho
  const dataRows = lines.slice(1);
  
  return dataRows.map((row, index) => {
    const columns = row.split(',');
    
    // Assumindo formato CSV: login, nome, status
    return {
      id: `client-${partnerId}-${index}`,
      partnerId,
      login: columns[0]?.trim() || "",
      name: columns[1]?.trim() || undefined,
      active: columns[2]?.trim().toLowerCase() === 'ativo',
      lastTransaction: "",
      balance: 0
    };
  });
};

// Função para obter todos os resumos de parceiros
export const getAllPartnerSummaries = (partners: Partner[]): PartnerSummary[] => {
  return partners.map(partner => calculatePartnerSummary(partner));
};

// Função para obter valores totais entre todos os parceiros
export const calculateTotalSummary = (partners: Partner[]) => {
  const summaries = getAllPartnerSummaries(partners);
  
  // Contar clientes únicos em todos os parceiros
  const uniqueClients = new Set();
  partners.forEach(partner => {
    const currentWeekTransactions = getCurrentWeekTransactions(partner.transactions);
    currentWeekTransactions.forEach(t => {
      if (t.clientName) {
        uniqueClients.add(t.clientName);
      }
    });
  });
  
  return {
    totalIn: summaries.reduce((sum, s) => sum + s.totalIn, 0),
    totalOut: summaries.reduce((sum, s) => sum + s.totalOut, 0),
    totalCommission: summaries.reduce((sum, s) => sum + s.commissionValue, 0),
    totalBonus: summaries.reduce((sum, s) => sum + s.bonus, 0),
    totalFinalBalance: summaries.reduce((sum, s) => sum + s.finalBalance, 0),
    partnerCount: partners.length,
    totalClientCount: uniqueClients.size
  };
};
