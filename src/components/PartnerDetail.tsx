
import { useState } from "react";
import { usePartners } from "@/context/PartnerContext";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Download, 
  Upload, 
  Clock, 
  Calendar, 
  User,
  Users,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Filter,
  DollarSign,
  AtSign
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import ImportCSV from "./ImportCSV";
import { Transaction } from "@/types/partner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ptBR } from "date-fns/locale";

const PartnerDetail = () => {
  const { partners, selectedPartnerId, setSelectedPartnerId, getPartnerSummary } = usePartners();
  const [isImporting, setIsImporting] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'entrada' | 'saida'>('all');
  const [detailView, setDetailView] = useState<'summary' | 'transactions'>('summary');

  if (!selectedPartnerId) return null;

  const partner = partners.find(p => p.id === selectedPartnerId);
  if (!partner) return null;

  const summary = getPartnerSummary(selectedPartnerId);

  // Obter transações dos últimos 7 dias
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentTransactions = partner.transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= sevenDaysAgo && 
        (transactionFilter === 'all' || t.type === transactionFilter);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Contar clientes únicos
  const getClientCount = () => {
    const uniqueClients = new Set();
    recentTransactions.forEach(t => {
      if (t.clientName) {
        uniqueClients.add(t.clientName);
      }
    });
    return uniqueClients.size;
  };

  const clientCount = getClientCount();

  const exportToCSV = () => {
    const headers = ['Data', 'Hora', 'Cliente', 'Login do Cliente', 'Descrição', 'Valor', 'Tipo', 'Método'];
    
    const csvRows = [
      headers.join(','),
      ...recentTransactions.map(t => {
        const dateTime = new Date(t.date);
        const formattedTime = t.time || format(dateTime, 'HH:mm', { locale: ptBR });
        
        return [
          format(dateTime, 'dd/MM/yyyy', { locale: ptBR }),
          formattedTime,
          t.clientName || '',
          t.clientLogin || '',
          t.description.replace(/"/g, '""'),
          t.amount.toFixed(2),
          t.type,
          t.method || ''
        ].join(',');
      })
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${partner.username}_transacoes_7_dias.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportComplete = () => {
    setIsImporting(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => setSelectedPartnerId(null)}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button 
            onClick={() => setIsImporting(true)}
            className="bg-master-gold hover:bg-master-darkGold text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-l-4 border-l-master-gold shadow-gold-soft hover:shadow-gold transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Detalhes do Parceiro</CardTitle>
              <Badge variant="outline" className="bg-master-gold/10 text-master-gold border-master-gold">
                ID: {partner.id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="flex items-center space-x-2">
              <div className="h-12 w-12 rounded-full bg-master-gold/20 flex items-center justify-center text-master-gold">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{partner.name}</h3>
                <p className="text-muted-foreground text-sm">{partner.username}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-master-gold/5 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Comissão</p>
                <p className="text-lg font-medium flex items-center">
                  <Badge variant="secondary" className="mr-2 bg-master-gold/10 text-master-gold">
                    {partner.commission}%
                  </Badge>
                </p>
              </div>
              <div className="bg-master-gold/5 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">Bônus</p>
                <p className="text-lg font-medium flex items-center">
                  <DollarSign className="h-4 w-4 text-master-gold mr-1" />
                  {formatCurrency(partner.bonus)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 shadow-gold-soft hover:shadow-gold transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Resumo Financeiro (7 Dias)</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">Entradas</p>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(summary?.totalIn || 0)}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-rose-700 dark:text-rose-300">Saídas</p>
                  <ArrowDownRight className="h-4 w-4 text-rose-500" />
                </div>
                <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                  {formatCurrency(summary?.totalOut || 0)}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-amber-700 dark:text-amber-300">Comissão</p>
                  <Badge variant="outline" className="h-5 text-xs bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300">
                    {partner.commission}%
                  </Badge>
                </div>
                <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                  {formatCurrency(summary?.commissionValue || 0)}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-blue-700 dark:text-blue-300">Bônus</p>
                  <DollarSign className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {formatCurrency(summary?.bonus || 0)}
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-master-gold/10 to-master-gold/5 p-4 rounded-lg border border-master-gold/20">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-master-gold">Saldo Final</p>
                <BarChart3 className="h-5 w-5 text-master-gold" />
              </div>
              <p className={`text-2xl font-bold ${(summary?.finalBalance || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {formatCurrency(summary?.finalBalance || 0)}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 mr-3">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Clientes Únicos</p>
                    <p className="text-sm font-semibold">{clientCount}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-500 mr-3">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transações</p>
                    <p className="text-sm font-semibold">{recentTransactions.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mb-4">
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Transações
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Clientes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-master-gold" />
                Transações (7 dias)
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={transactionFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTransactionFilter('all')}
                >
                  Todas
                </Button>
                <Button 
                  variant={transactionFilter === 'entrada' ? 'default' : 'outline'}
                  size="sm" 
                  onClick={() => setTransactionFilter('entrada')}
                  className="text-emerald-500"
                >
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Entradas
                </Button>
                <Button 
                  variant={transactionFilter === 'saida' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setTransactionFilter('saida')}
                  className="text-rose-500"
                >
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  Saídas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma transação encontrada nos últimos 7 dias</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => {
                    // Extrair nome do cliente do description ou usar o campo direto
                    const clientName = transaction.clientName || 
                      (transaction.description.match(/"([^"]+)"/) ? 
                        transaction.description.match(/"([^"]+)"/)![1] : 'Cliente');
                    
                    // Criar timestamp
                    const transactionDate = new Date(transaction.date);
                    const formattedTime = transaction.time || format(transactionDate, 'HH:mm', { locale: ptBR });
                    
                    return (
                      <div 
                        key={transaction.id} 
                        className={`flex items-center justify-between p-4 rounded-lg border
                          ${transaction.type === 'entrada' 
                            ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900/50' 
                            : 'border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900/50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full
                            ${transaction.type === 'entrada' 
                              ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-900/70' 
                              : 'bg-rose-100 text-rose-500 dark:bg-rose-900/70'}`}
                          >
                            {transaction.type === 'entrada' ? (
                              <ArrowUpRight className="h-5 w-5" />
                            ) : (
                              <ArrowDownRight className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center flex-wrap gap-2">
                              <p className="font-medium">{transaction.description.replace(/"/g, '')}</p>
                              {transaction.clientName && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs bg-indigo-100 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
                                >
                                  {clientName}
                                </Badge>
                              )}
                              {transaction.clientLogin && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 flex items-center"
                                >
                                  <AtSign className="h-3 w-3 mr-1" />
                                  {transaction.clientLogin}
                                </Badge>
                              )}
                              {transaction.method && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                                >
                                  {transaction.method}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground gap-3 mt-1">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {format(transactionDate, 'dd/MM/yyyy', { locale: ptBR })}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formattedTime}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className={`font-semibold ${transaction.type === 'entrada' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {transaction.type === 'entrada' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Exibindo apenas transações dos últimos 7 dias
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5 text-master-gold" />
                Clientes (7 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clientCount === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum cliente encontrado nos últimos 7 dias</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Extrair clientes únicos e suas transações totais */}
                  {(() => {
                    const clientMap = new Map();
                    
                    recentTransactions.forEach(t => {
                      const clientName = t.clientName || 
                        (t.description.match(/"([^"]+)"/) ? 
                          t.description.match(/"([^"]+)"/)![1] : 'Cliente');
                      
                      if (!clientMap.has(clientName)) {
                        clientMap.set(clientName, {
                          name: clientName,
                          login: t.clientLogin || '',
                          transactions: 0,
                          totalIn: 0,
                          totalOut: 0
                        });
                      }
                      
                      const clientData = clientMap.get(clientName);
                      clientData.transactions++;
                      
                      if (t.type === 'entrada') {
                        clientData.totalIn += t.amount;
                      } else {
                        clientData.totalOut += t.amount;
                      }
                    });
                    
                    // Ordenar por contagem de transações
                    return Array.from(clientMap.values())
                      .sort((a, b) => b.transactions - a.transactions)
                      .map((client, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-4 rounded-lg border bg-muted/20"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{client.name}</p>
                                {client.login && (
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs bg-purple-100 text-purple-600 border-purple-200 flex items-center"
                                  >
                                    <AtSign className="h-3 w-3 mr-1" />
                                    {client.login}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {client.transactions} transações nos últimos 7 dias
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center">
                              <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                              <span className="text-sm text-emerald-500">
                                {formatCurrency(client.totalIn)}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <ArrowDownRight className="h-3 w-3 text-rose-500 mr-1" />
                              <span className="text-sm text-rose-500">
                                {formatCurrency(client.totalOut)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ));
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Import CSV Dialog */}
      <Dialog open={isImporting} onOpenChange={setIsImporting}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Importar Transações</DialogTitle>
            <DialogDescription>
              Importe transações CSV para o parceiro {partner.name}
            </DialogDescription>
          </DialogHeader>
          <ImportCSV 
            partnerId={selectedPartnerId} 
            onComplete={handleImportComplete}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerDetail;
