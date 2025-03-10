
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format as fnsFormat } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Transaction } from "@/types/partner"; 

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

// Função para extrair nomes de clientes únicos das transações
export function getUniqueClientCount(transactions: Transaction[]): number {
  const uniqueClients = new Set();
  
  transactions.forEach(transaction => {
    if (transaction.clientName) {
      uniqueClients.add(transaction.clientName);
    } else {
      // Tenta extrair o nome do cliente da descrição para compatibilidade
      const clientMatch = transaction.description.match(/"([^"]+)"/);
      if (clientMatch && clientMatch[1]) {
        uniqueClients.add(clientMatch[1]);
      }
    }
  });
  
  return uniqueClients.size;
}

// Função para extrair logins de clientes únicos das transações
export function getUniqueClientLogins(transactions: Transaction[]): string[] {
  const uniqueLogins = new Set<string>();
  
  transactions.forEach(transaction => {
    if (transaction.clientLogin) {
      uniqueLogins.add(transaction.clientLogin);
    }
  });
  
  return Array.from(uniqueLogins);
}

// Função para obter métodos de pagamento usados
export function getPaymentMethods(transactions: Transaction[]): string[] {
  const methods = new Set<string>();
  
  transactions.forEach(transaction => {
    if (transaction.method) {
      methods.add(transaction.method);
    }
  });
  
  return Array.from(methods);
}
