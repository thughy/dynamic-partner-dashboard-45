
import { LoginCredentials, Transaction, Partner } from '@/types/partner';
import { toast } from '@/hooks/use-toast';

export const fetchPartnersFromWebsite = async (credentials: LoginCredentials): Promise<Partner[] | null> => {
  try {
    // Em uma implementação real, isso envolveria:
    // 1. Logar no site
    // 2. Navegar para a página de parceiros
    // 3. Extrair os dados dos parceiros
    // 4. Analisar os dados no nosso formato Partner
    
    console.log('Buscando parceiros do site com credenciais:', credentials);
    
    // Simular uma chamada de API com um atraso
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Dados simulados para demonstração - incluindo parceiros sem transações
    const mockPartners: Partner[] = [
      {
        id: '1',
        name: 'Tayna',
        username: '@tayna',
        commission: 10,
        bonus: 50,
        transactions: [],
        active: true
      },
      {
        id: '2',
        name: 'Raquel',
        username: '@raquel',
        commission: 8,
        bonus: 75,
        transactions: [],
        active: true
      },
      {
        id: '3',
        name: 'Carlos',
        username: '@carlos',
        commission: 12,
        bonus: 30,
        transactions: [],
        active: true
      },
      {
        id: '4',
        name: 'Ana',
        username: '@ana',
        commission: 9,
        bonus: 40,
        transactions: [],
        active: false
      },
      {
        id: '5',
        name: 'Pedro',
        username: '@pedro',
        commission: 11,
        bonus: 45,
        transactions: [],
        active: true
      }
    ];
    
    toast({
      title: "Parceiros importados",
      description: `${mockPartners.length} parceiros importados com sucesso.`,
    });
    
    return mockPartners;
  } catch (error) {
    console.error('Erro ao buscar parceiros do site:', error);
    
    toast({
      title: "Erro na importação",
      description: "Ocorreu um erro ao importar parceiros do site.",
      variant: "destructive",
    });
    
    return null;
  }
};

export const fetchPartnerTransactions = async (partner: Partner, credentials: LoginCredentials): Promise<Transaction[] | null> => {
  try {
    // Em uma implementação real, isso envolveria:
    // 1. Logar no site (se ainda não estiver logado)
    // 2. Navegar para a página de transações do parceiro
    // 3. Extrair os dados das transações
    // 4. Analisar os dados no nosso formato Transaction
    
    console.log(`Buscando transações para o parceiro ${partner.username} com credenciais:`, credentials);
    
    // Simular uma chamada de API com um atraso
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Gerar algumas transações aleatórias para os últimos 7 dias
    const transactions: Transaction[] = [];
    const today = new Date();
    
    // Lista de nomes e logins de clientes para simulação
    const clientsData = [
      { name: "Maria Silva", login: "@mariasilva123" },
      { name: "João Santos", login: "@joaosantos44" },
      { name: "Paulo Oliveira", login: "@paulooliveira" },
      { name: "Claudia Mendes", login: "@clau_mendes" },
      { name: "Roberto Alves", login: "@ralves987" },
    ];
    
    for (let i = 0; i < 10; i++) {
      const daysAgo = Math.floor(Math.random() * 7);
      const transactionDate = new Date();
      transactionDate.setDate(today.getDate() - daysAgo);
      
      // Adicionar hora aleatória
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      transactionDate.setHours(hours, minutes);
      
      const isIncome = Math.random() > 0.3; // 70% chance de entrada, 30% chance de saída
      
      // Selecionar um cliente aleatório
      const clientIndex = Math.floor(Math.random() * clientsData.length);
      const clientData = clientsData[clientIndex];
      
      transactions.push({
        id: `${partner.id}-${Date.now()}-${i}`,
        partnerId: partner.id,
        date: transactionDate.toISOString().split('T')[0],
        time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        amount: Math.floor(Math.random() * 500) + 100,
        type: isIncome ? 'entrada' : 'saida',
        description: isIncome ? `Depósito Cliente "${clientData.name}"` : 'Saque',
        clientName: isIncome ? clientData.name : undefined,
        clientLogin: isIncome ? clientData.login : undefined,
        method: isIncome ? 'PIX' : undefined
      });
    }
    
    toast({
      title: "Transações importadas",
      description: `${transactions.length} transações importadas com sucesso para ${partner.username}.`,
    });
    
    return transactions;
  } catch (error) {
    console.error(`Erro ao buscar transações para o parceiro ${partner.username}:`, error);
    
    toast({
      title: "Erro na importação",
      description: `Ocorreu um erro ao importar transações para ${partner.username}.`,
      variant: "destructive",
    });
    
    return null;
  }
};

export const downloadCSV = async (partner: Partner, credentials: LoginCredentials): Promise<string | null> => {
  try {
    // Em uma implementação real, isso envolveria:
    // 1. Logar no site (se ainda não estiver logado)
    // 2. Navegar para a página de exportação do parceiro
    // 3. Acionar o download do CSV
    // 4. Lidar com o download do arquivo
    
    console.log(`Baixando CSV para o parceiro ${partner.username} com credenciais:`, credentials);
    
    // Simular uma chamada de API com um atraso
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock do conteúdo CSV
    const transactions = await fetchPartnerTransactions(partner, credentials);
    if (!transactions) return null;
    
    const csvHeader = "date,time,client,client_login,description,amount,type,method\n";
    const csvRows = transactions.map(t => 
      `${t.date},${t.time || ''},"${t.clientName || ''}","${t.clientLogin || ''}","${t.description}",${t.amount},${t.type === 'entrada' ? 'ENTRADA' : 'SAIDA'},"${t.method || ''}"`
    );
    
    const csvContent = csvHeader + csvRows.join('\n');
    
    toast({
      title: "CSV gerado",
      description: `CSV para ${partner.username} gerado com sucesso.`,
    });
    
    return csvContent;
  } catch (error) {
    console.error(`Erro ao baixar CSV para o parceiro ${partner.username}:`, error);
    
    toast({
      title: "Erro ao gerar CSV",
      description: `Ocorreu um erro ao gerar CSV para ${partner.username}.`,
      variant: "destructive",
    });
    
    return null;
  }
};
