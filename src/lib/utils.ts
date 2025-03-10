
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format as fnsFormat } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: Date | string, formatStr: string = "dd/MM/yyyy"): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return fnsFormat(dateObj, formatStr, { locale: ptBR });
}

export function formatTime(date: Date | string, formatStr: string = "HH:mm"): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return fnsFormat(dateObj, formatStr, { locale: ptBR });
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return fnsFormat(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function dateIsInLastSevenDays(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return dateObj >= sevenDaysAgo;
}

// Function to extract unique client names from transactions
export function getUniqueClientCount(transactions: Transaction[]): number {
  const uniqueClients = new Set();
  
  transactions.forEach(transaction => {
    if (transaction.clientName) {
      uniqueClients.add(transaction.clientName);
    }
  });
  
  return uniqueClients.size;
}
