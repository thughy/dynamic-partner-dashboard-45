
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { usePartners } from "@/context/PartnerContext";
import { Transaction } from "@/types/partner";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Download, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Create a comprehensive transaction report component
const ClientTransactionReport = () => {
  const { partners } = usePartners();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPartner, setSelectedPartner] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  // Get all transactions from all partners
  const allTransactions = partners.flatMap((partner) => 
    partner.transactions.map(transaction => ({
      ...transaction,
      partnerName: partner.name,
      partnerUsername: partner.username
    }))
  );

  // Filter transactions based on search and filters
  const filteredTransactions = allTransactions.filter((transaction) => {
    // Filter by search term
    const searchMatch = 
      transaction.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.clientLogin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.partnerUsername.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by partner
    const partnerMatch = selectedPartner === "all" || transaction.partnerId === selectedPartner;
    
    // Filter by transaction type
    const typeMatch = selectedType === "all" || transaction.type === selectedType;
    
    // Filter by date range
    let dateMatch = true;
    if (dateRange.from && dateRange.to) {
      const transactionDate = new Date(transaction.date);
      dateMatch = transactionDate >= dateRange.from && transactionDate <= dateRange.to;
    }
    
    return searchMatch && partnerMatch && typeMatch && dateMatch;
  });

  // Sort transactions by date, newest first
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate totals for filtered transactions
  const totalEntrada = sortedTransactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalSaida = sortedTransactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  // Handle date range change
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
  };

  // Export transactions to CSV
  const exportToCSV = () => {
    // Generate CSV headers
    const headers = ['Data', 'Hora', 'Cliente', 'Login', 'Parceiro', 'Descrição', 'Valor', 'Tipo', 'Método'];
    
    // Generate CSV rows
    const rows = sortedTransactions.map(t => [
      formatDate(t.date),
      t.time || '',
      t.clientName || '',
      t.clientLogin || '',
      t.partnerName,
      t.description,
      t.amount.toString(),
      t.type === 'entrada' ? 'Entrada' : 'Saída',
      t.method || ''
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transacoes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Relatório de Transações</CardTitle>
        <CardDescription>
          Visualize e filtre todas as transações de clientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cliente, login ou descrição..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partner">Parceiro</Label>
              <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                <SelectTrigger id="partner">
                  <SelectValue placeholder="Todos os parceiros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os parceiros</SelectItem>
                  {partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name} ({partner.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Período</Label>
              <DatePickerWithRange onSelect={handleDateRangeChange} />
            </div>
          </div>
          
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-muted/40">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total de Transações</p>
                    <p className="text-2xl font-bold">{sortedTransactions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/40">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total de Entradas</p>
                    <p className="text-2xl font-bold text-emerald-500">{formatCurrency(totalEntrada)}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/40">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Total de Saídas</p>
                    <p className="text-2xl font-bold text-rose-500">{formatCurrency(totalSaida)}</p>
                  </div>
                  <ArrowDownRight className="h-5 w-5 text-rose-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Export Button */}
          <div className="flex justify-end">
            <Button 
              variant="outline"
              onClick={exportToCSV}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
          
          {/* Transactions Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Login</TableHead>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Método</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {formatDate(transaction.date)}
                        {transaction.time && <div className="text-xs text-muted-foreground">{transaction.time}</div>}
                      </TableCell>
                      <TableCell>{transaction.clientName || "-"}</TableCell>
                      <TableCell>{transaction.clientLogin || "-"}</TableCell>
                      <TableCell>
                        <div>{transaction.partnerName}</div>
                        <div className="text-xs text-muted-foreground">{transaction.partnerUsername}</div>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className={transaction.type === "entrada" ? "text-emerald-500" : "text-rose-500"}>
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === "entrada" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {transaction.type === "entrada" ? "Entrada" : "Saída"}
                        </div>
                      </TableCell>
                      <TableCell>{transaction.method || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientTransactionReport;
