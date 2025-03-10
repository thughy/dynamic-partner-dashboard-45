
export interface Partner {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  income: number;
  outcome: number;
  commission: number;
  bonus: number;
  balance: number;
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  partnerId: string;
  amount: number;
  type: 'income' | 'outcome';
  description: string;
  date: Date;
}

export interface CSVImportData {
  filename: string;
  partnerUsername: string;
  date: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  records?: number;
  error?: string;
}

export interface PartnerStats {
  totalIncome: number;
  totalOutcome: number;
  totalCommission: number;
  totalBonus: number;
  finalBalance: number;
}
