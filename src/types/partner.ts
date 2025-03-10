
export interface Transaction {
  id: string;
  partnerId: string;
  date: string;
  amount: number;
  type: 'entrada' | 'saida';
  description: string;
  clientName?: string;   // Adding client name field
  time?: string;         // Adding transaction time
  method?: string;       // Adding payment method (like "PIX")
}

export interface Partner {
  id: string;
  name: string;
  username: string;
  commission: number; // Percentage
  bonus: number;      // Fixed value
  transactions: Transaction[];
  clientCount?: number; // Adding client count
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
  clientCount?: number; // Adding client count
  transactionCount?: number; // Adding transaction count
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetId: number;
}

export interface SyncStatus {
  lastSync: string;
  status: 'idle' | 'syncing' | 'success' | 'error';
  message?: string;
}
