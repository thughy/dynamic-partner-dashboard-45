
import { Partner, Transaction, PartnerSummary } from '@/types/partner';

// Function to get transactions from the last 7 days
export const getLastSevenDaysTransactions = (transactions: Transaction[]): Transaction[] => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= sevenDaysAgo;
  });
};

// Function to calculate partner summary based on last 7 days
export const calculatePartnerSummary = (partner: Partner): PartnerSummary => {
  const lastSevenDaysTransactions = getLastSevenDaysTransactions(partner.transactions);
  
  const totalIn = lastSevenDaysTransactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalOut = lastSevenDaysTransactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const commissionValue = totalIn * (partner.commission / 100);
  const finalBalance = totalIn - totalOut - commissionValue + partner.bonus;
  
  return {
    id: partner.id,
    name: partner.name,
    username: partner.username,
    totalIn,
    totalOut,
    commission: partner.commission,
    commissionValue,
    bonus: partner.bonus,
    finalBalance
  };
};

// Function to parse CSV data
export const parseCSVData = (csvText: string, partnerId: string): Transaction[] => {
  const lines = csvText.trim().split('\n');
  
  // Skip header row
  const dataRows = lines.slice(1);
  
  return dataRows.map((row, index) => {
    const columns = row.split(',');
    
    // Assuming CSV format: date, description, amount, type
    return {
      id: `${partnerId}-${index}`,
      partnerId,
      date: columns[0].trim(),
      description: columns[1].trim(),
      amount: parseFloat(columns[2].trim().replace(/[^0-9.-]+/g, '')),
      type: columns[3].trim().toLowerCase().includes('entrada') ? 'entrada' : 'saida'
    };
  });
};

// Function to get all partner summaries
export const getAllPartnerSummaries = (partners: Partner[]): PartnerSummary[] => {
  return partners.map(partner => calculatePartnerSummary(partner));
};

// Function to get total amounts across all partners
export const calculateTotalSummary = (partners: Partner[]) => {
  const summaries = getAllPartnerSummaries(partners);
  
  return {
    totalIn: summaries.reduce((sum, s) => sum + s.totalIn, 0),
    totalOut: summaries.reduce((sum, s) => sum + s.totalOut, 0),
    totalCommission: summaries.reduce((sum, s) => sum + s.commissionValue, 0),
    totalBonus: summaries.reduce((sum, s) => sum + s.bonus, 0),
    totalFinalBalance: summaries.reduce((sum, s) => sum + s.finalBalance, 0),
    partnerCount: partners.length
  };
};
