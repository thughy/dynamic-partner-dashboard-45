
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  TrendingUp, 
  Calendar, 
  ChevronRight,
  RefreshCw 
} from "lucide-react";
import { Partner, PartnerStats } from '@/types';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

// Dummy data for visualization
const generateDummyPartners = (): Partner[] => {
  const partners = [
    { username: 'tayna', name: 'Tayna Silva' },
    { username: 'raquel', name: 'Raquel Oliveira' },
    { username: 'carlos', name: 'Carlos Mendes' },
    { username: 'julia', name: 'Julia Costa' },
    { username: 'ricardo', name: 'Ricardo Alves' },
  ];
  
  return partners.map((partner, index) => ({
    id: `p${index}`,
    username: partner.username,
    name: partner.name,
    income: Math.round(Math.random() * 10000) + 5000,
    outcome: Math.round(Math.random() * 3000) + 1000,
    commission: Math.round(Math.random() * 1500) + 500,
    bonus: Math.round(Math.random() * 500),
    balance: 0, // Will be calculated
    lastUpdated: new Date(Date.now() - Math.random() * 86400000 * 3),
  })).map(partner => ({
    ...partner,
    balance: partner.income - partner.outcome + partner.commission + partner.bonus
  }));
};

const generateChartData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    data.push({
      date: format(date, 'dd/MM'),
      income: Math.round(Math.random() * 3000) + 1000,
      outcome: Math.round(Math.random() * 1000) + 200,
    });
  }
  
  return data;
};

const calculateStats = (partners: Partner[]): PartnerStats => {
  return partners.reduce((stats, partner) => {
    return {
      totalIncome: stats.totalIncome + partner.income,
      totalOutcome: stats.totalOutcome + partner.outcome,
      totalCommission: stats.totalCommission + partner.commission,
      totalBonus: stats.totalBonus + partner.bonus,
      finalBalance: stats.finalBalance + partner.balance
    };
  }, {
    totalIncome: 0,
    totalOutcome: 0,
    totalCommission: 0,
    totalBonus: 0,
    finalBalance: 0
  });
};

const Dashboard = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [stats, setStats] = useState<PartnerStats>({
    totalIncome: 0,
    totalOutcome: 0,
    totalCommission: 0,
    totalBonus: 0,
    finalBalance: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [periodStart, setPeriodStart] = useState<Date>(subDays(new Date(), 6));
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const dummyPartners = generateDummyPartners();
      setPartners(dummyPartners);
      
      const calculatedStats = calculateStats(dummyPartners);
      setStats(calculatedStats);
      
      setChartData(generateChartData());
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate refreshing data
    setTimeout(() => {
      const dummyPartners = generateDummyPartners();
      setPartners(dummyPartners);
      
      const calculatedStats = calculateStats(dummyPartners);
      setStats(calculatedStats);
      
      setChartData(generateChartData());
      
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Resumo dos últimos 7 dias ({format(periodStart, 'dd/MM/yyyy')} - {format(periodEnd, 'dd/MM/yyyy')})
          </p>
        </div>
        
        <Button 
          onClick={refreshData} 
          className="mt-4 md:mt-0"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar dados
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className={`glass-card shadow-gold-soft overflow-hidden ${isLoading ? 'animate-pulse' : 'animate-fade-up animate-delay-1'}`}>
          <CardHeader className="pb-2">
            <CardDescription>Total de Entradas</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {isLoading ? (
                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
              ) : (
                <>
                  {formatCurrency(stats.totalIncome)}
                  <ArrowUpRight className="ml-2 h-5 w-5 text-green-500" />
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-12 w-full">
              {!isLoading && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#10B981" 
                      fillOpacity={1} 
                      fill="url(#colorIncome)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className={`glass-card shadow-gold-soft overflow-hidden ${isLoading ? 'animate-pulse' : 'animate-fade-up animate-delay-2'}`}>
          <CardHeader className="pb-2">
            <CardDescription>Total de Saídas</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {isLoading ? (
                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
              ) : (
                <>
                  {formatCurrency(stats.totalOutcome)}
                  <ArrowDownRight className="ml-2 h-5 w-5 text-red-500" />
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-12 w-full">
              {!isLoading && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="outcome" 
                      stroke="#EF4444" 
                      fillOpacity={1} 
                      fill="url(#colorOutcome)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className={`glass-card shadow-gold-soft ${isLoading ? 'animate-pulse' : 'animate-fade-up animate-delay-3'}`}>
          <CardHeader className="pb-2">
            <CardDescription>Parceiros Ativos</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
              ) : (
                <>
                  {partners.length}
                  <Users className="ml-2 h-5 w-5 text-blue-500" />
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isLoading ? (
                <>
                  <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                  <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                </>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Última atualização: </p>
                  <p>{format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className={`glass-card shadow-gold-soft ${isLoading ? 'animate-pulse' : 'animate-fade-up animate-delay-4'}`}>
          <CardHeader className="pb-2">
            <CardDescription>Saldo Total</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {isLoading ? (
                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
              ) : (
                <>
                  {formatCurrency(stats.finalBalance)}
                  <TrendingUp className="ml-2 h-5 w-5 text-master-gold" />
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {isLoading ? (
                <>
                  <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                  <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Comissões:</span>
                    <span>{formatCurrency(stats.totalCommission)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Bônus:</span>
                    <span>{formatCurrency(stats.totalBonus)}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className={`glass-card shadow-gold-soft col-span-1 lg:col-span-2 ${isLoading ? 'animate-pulse' : 'animate-fade-up animate-delay-1'}`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Fluxo de Caixa (7 dias)</CardTitle>
                <CardDescription>Entradas e saídas dos últimos 7 dias</CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `R$ ${value}`} />
                    <Tooltip 
                      formatter={(value) => [`R$ ${value}`, undefined]}
                      labelFormatter={(label) => `Data: ${label}`}
                      contentStyle={{ 
                        backgroundColor: 'rgba(17, 25, 40, 0.8)', 
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        borderRadius: '8px'
                      }}
                    />
                    <defs>
                      <linearGradient id="colorIncome2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOutcome2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#10B981" 
                      fillOpacity={1} 
                      fill="url(#colorIncome2)" 
                      name="Entradas"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="outcome" 
                      stroke="#EF4444" 
                      fillOpacity={1} 
                      fill="url(#colorOutcome2)" 
                      name="Saídas"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className={`glass-card shadow-gold-soft ${isLoading ? 'animate-pulse' : 'animate-fade-up animate-delay-2'}`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Top Parceiros</CardTitle>
                <CardDescription>Por volume de entrada</CardDescription>
              </div>
              <Users className="h-5 w-5 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                    <div className="ml-4 space-y-1 flex-1">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                  </div>
                ))
              ) : (
                partners
                  .sort((a, b) => b.income - a.income)
                  .slice(0, 5)
                  .map((partner, index) => (
                    <div 
                      key={partner.id} 
                      className="flex items-center p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      onClick={() => navigate(`/partners/${partner.username}`)}
                    >
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-master-gold text-master-black font-medium">
                        {partner.name.charAt(0)}
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-medium">@{partner.username}</p>
                        <p className="text-sm text-gray-500">{partner.name}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-right">{formatCurrency(partner.income)}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/partners')}
              className="w-full text-master-gold hover:text-master-darkGold"
            >
              Ver todos os parceiros
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className={`glass-card shadow-gold-soft mb-8 ${isLoading ? 'animate-pulse' : 'animate-fade-up animate-delay-3'}`}>
        <CardHeader>
          <CardTitle className="text-xl">Fechamento de Pagamentos</CardTitle>
          <CardDescription>
            Valores a pagar para cada parceiro com base nos últimos 7 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="paid">Pagos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Parceiro</th>
                      <th className="text-right py-3 px-4 font-medium">Entradas</th>
                      <th className="text-right py-3 px-4 font-medium">Saídas</th>
                      <th className="text-right py-3 px-4 font-medium">Comissão</th>
                      <th className="text-right py-3 px-4 font-medium">Bônus</th>
                      <th className="text-right py-3 px-4 font-medium">A Pagar</th>
                      <th className="text-center py-3 px-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                              <div className="ml-3 space-y-1">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                              </div>
                            </div>
                          </td>
                          {Array(5).fill(0).map((_, j) => (
                            <td key={j} className="py-3 px-4 text-right">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                            </td>
                          ))}
                          <td className="py-3 px-4 text-center">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      partners.map((partner) => (
                        <tr key={partner.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-master-gold text-master-black font-medium text-sm">
                                {partner.name.charAt(0)}
                              </div>
                              <div className="ml-3">
                                <p className="font-medium">@{partner.username}</p>
                                <p className="text-xs text-gray-500">{partner.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">{formatCurrency(partner.income)}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(partner.outcome)}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(partner.commission)}</td>
                          <td className="py-3 px-4 text-right">{formatCurrency(partner.bonus)}</td>
                          <td className="py-3 px-4 text-right font-semibold">{formatCurrency(partner.balance)}</td>
                          <td className="py-3 px-4 text-center">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/partners/${partner.username}`)}
                            >
                              Detalhes
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">Nenhum pagamento pendente no momento.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="paid" className="mt-0">
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">Nenhum pagamento finalizado no período.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
