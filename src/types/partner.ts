
export interface Transaction {
  id: string;
  partnerId: string;
  date: string;
  amount: number;
  type: 'entrada' | 'saida';
  description: string;
  clientName?: string;   // Nome do cliente
  clientLogin?: string;  // Login/conta do cliente que efetuou a transação
  time?: string;         // Horário da transação
  method?: string;       // Método de pagamento (como "PIX")
}

export interface Client {
  id: string;
  partnerId: string;
  login: string;         // @ do cliente
  name?: string;         // Nome do cliente (opcional)
  active?: boolean;      // Se o cliente está ativo
  lastTransaction?: string; // Data da última transação
  balance?: number;      // Saldo atual (opcional)
  notes?: string;        // Observações
}

export interface Partner {
  id: string;
  name: string;
  username: string;
  commission: number; // Percentual
  bonus: number;      // Valor fixo
  transactions: Transaction[];
  clients: Client[];  // Nova lista de clientes
  clientCount?: number; // Contagem de clientes
  active?: boolean;     // Se o parceiro está ativo ou não
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
  clientCount?: number; // Contagem de clientes
  transactionCount?: number; // Contagem de transações
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
