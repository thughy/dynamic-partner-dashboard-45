
import { useState } from "react";
import { usePartners } from "@/context/PartnerContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Upload, Clock, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import ImportCSV from "./ImportCSV";
import { Partner, Transaction } from "@/types/partner";
import { format } from "date-fns";

const PartnerDetail = () => {
  const { partners, selectedPartnerId, setSelectedPartnerId, getPartnerSummary } = usePartners();
  const [isImporting, setIsImporting] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'entrada' | 'saida'>('all');

  if (!selectedPartnerId) return null;

  const partner = partners.find(p => p.id === selectedPartnerId);
  if (!partner) return null;

  const summary = getPartnerSummary(selectedPartnerId);

  // Get last 7 days transactions
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentTransactions = partner.transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= sevenDaysAgo && 
        (transactionFilter === 'all' || t.type === transactionFilter);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const exportToCSV = () => {
    const headers = ['Data', 'Descrição', 'Valor', 'Tipo'];
    
    const csvRows = [
      headers.join(','),
      ...recentTransactions.map(t => [
        t.date,
        t.description,
        t.amount.toFixed(2),
        t.type
      ].join(','))
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
    <div className="space-y-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Parceiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{partner.name}</h3>
              <p className="text-muted-foreground">{partner.username}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm text-muted-foreground">Comissão</p>
                <p className="text-lg font-medium">{partner.commission}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bônus</p>
                <p className="text-lg font-medium">{formatCurrency(partner.bonus)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resumo (Últimos 7 dias)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Entradas</p>
                <p className="text-lg font-medium text-emerald-500">
                  {formatCurrency(summary?.totalIn || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saídas</p>
                <p className="text-lg font-medium text-rose-500">
                  {formatCurrency(summary?.totalOut || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Comissão</p>
                <p className="text-lg font-medium">
                  {formatCurrency(summary?.commissionValue || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bônus</p>
                <p className="text-lg font-medium">
                  {formatCurrency(summary?.bonus || 0)}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Saldo Final</p>
              <p className={`text-xl font-bold ${(summary?.finalBalance || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {formatCurrency(summary?.finalBalance || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transações Recentes (7 dias)</CardTitle>
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
              Entradas
            </Button>
            <Button 
              variant={transactionFilter === 'saida' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTransactionFilter('saida')}
              className="text-rose-500"
            >
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
              {recentTransactions.map((transaction, index) => (
                <div 
                  key={transaction.id} 
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${transaction.type === 'entrada' ? 'bg-emerald-100 text-emerald-500' : 'bg-rose-100 text-rose-500'}`}>
                      {transaction.type === 'entrada' ? (
                        <Download className="h-5 w-5" />
                      ) : (
                        <Upload className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(transaction.date), 'dd/MM/yyyy')}
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
              ))}
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

      {/* Import CSV Dialog */}
      <Dialog open={isImporting} onOpenChange={setIsImporting}>
        <DialogContent className="sm:max-w-[550px]">
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
