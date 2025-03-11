
import { useState } from "react";
import { usePartners } from "@/context/PartnerContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { 
  BadgeDollarSign, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";

// Create a component for commission dashboard
const CommissionDashboard = () => {
  const { getAllPartnerSummaries, getTotalSummary } = usePartners();
  
  const partnerSummaries = getAllPartnerSummaries();
  const totalSummary = getTotalSummary();
  
  // Sort partners by commission value
  const sortedByCommission = [...partnerSummaries].sort((a, b) => b.commissionValue - a.commissionValue);
  
  // Prepare data for BarChart
  const chartData = partnerSummaries.map(summary => ({
    name: summary.name,
    Entradas: summary.totalIn,
    Saídas: summary.totalOut,
    Comissão: summary.commissionValue,
    Saldo: summary.finalBalance
  }));
  
  // Prepare data for PieChart
  const pieData = partnerSummaries.map(summary => ({
    name: summary.name,
    value: summary.commissionValue
  }));
  
  // Custom colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-100 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Entradas (7d)
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              {formatCurrency(totalSummary.totalIn)}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-rose-100 to-pink-50 dark:from-rose-900/10 dark:to-pink-900/20 border-rose-200 dark:border-rose-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Saídas (7d)
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">
              {formatCurrency(totalSummary.totalOut)}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total em Comissões
            </CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {formatCurrency(totalSummary.totalCommission)}
            </div>
            <p className="text-xs text-muted-foreground">
              Calculado para os parceiros
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-cyan-100 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-800/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Desempenho dos Parceiros
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {totalSummary.partnerCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Parceiros ativos
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Visão Geral de Entradas, Saídas e Comissões</CardTitle>
            <CardDescription>
              Comparativo de valores por parceiro nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar dataKey="Entradas" fill="#82ca9d" />
                  <Bar dataKey="Saídas" fill="#ff8042" />
                  <Bar dataKey="Comissão" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Comissões</CardTitle>
            <CardDescription>
              Porcentagem do total por parceiro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Comissões</CardTitle>
            <CardDescription>
              Parceiros ordenados por valor de comissão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posição</TableHead>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Comissão (%)</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Saldo Final</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedByCommission.map((summary, index) => (
                  <TableRow key={summary.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>{summary.name}</div>
                      <div className="text-xs text-muted-foreground">{summary.username}</div>
                    </TableCell>
                    <TableCell>{summary.commission}%</TableCell>
                    <TableCell className="text-amber-500">{formatCurrency(summary.commissionValue)}</TableCell>
                    <TableCell className={summary.finalBalance >= 0 ? "text-emerald-500" : "text-rose-500"}>
                      {formatCurrency(summary.finalBalance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommissionDashboard;
