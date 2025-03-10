
export interface Transaction {
  id: string;
  partnerId: string;
  date: string;
  amount: number;
  type: 'entrada' | 'saida';
  description: string;
}

export interface Partner {
  id: string;
  name: string;
  username: string;
  commission: number; // Percentage
  bonus: number;      // Fixed value
  transactions: Transaction[];
}

export interface PartnerSummary {
  id: string;
  name: string;
  username: string;
  totalIn: number;
  totalOut: number;
  commission: number;
  commissionValue: number;
  bonus: number;
  finalBalance: number;
}
