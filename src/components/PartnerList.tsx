
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ChevronDown,
  Search,
  Filter,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  Download,
  MoreHorizontal
} from "lucide-react";
import { Partner } from '@/types';
import { format } from 'date-fns';

// Dummy data generation for visualization
const generateDummyPartners = (): Partner[] => {
  const partners = [
    { username: 'tayna', name: 'Tayna Silva' },
    { username: 'raquel', name: 'Raquel Oliveira' },
    { username: 'carlos', name: 'Carlos Mendes' },
    { username: 'julia', name: 'Julia Costa' },
    { username: 'ricardo', name: 'Ricardo Alves' },
    { username: 'ana', name: 'Ana Paula Santos' },
    { username: 'bruno', name: 'Bruno Ferreira' },
    { username: 'camila', name: 'Camila Rodrigues' },
    { username: 'daniel', name: 'Daniel Gomes' },
    { username: 'eduardo', name: 'Eduardo Martins' },
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

const PartnerList = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Partner>('income');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const dummyPartners = generateDummyPartners();
      setPartners(dummyPartners);
      setFilteredPartners(dummyPartners);
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    // Filter and sort partners
    let result = [...partners];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        partner => 
          partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partner.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue);
        }
        return (aValue as number) - (bValue as number);
      } else {
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return bValue.localeCompare(aValue);
        }
        return (bValue as number) - (aValue as number);
      }
    });
    
    setFilteredPartners(result);
  }, [partners, searchTerm, sortField, sortDirection]);
  
  const handleSort = (field: keyof Partner) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
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
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Parceiros</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gerenciamento de parceiros e transações
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
      
      <Card className="glass-card shadow-gold-soft overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl">Lista de Parceiros</CardTitle>
          <CardDescription>
            Visualize e gerencie os parceiros cadastrados
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full lg:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar parceiro..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter size={16} />
                    Filtrar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Todos os parceiros</DropdownMenuItem>
                  <DropdownMenuItem>Ativos apenas</DropdownMenuItem>
                  <DropdownMenuItem>Inativos apenas</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal size={16} />
                    Ordenar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSort('income')}>
                    Maior entrada
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('outcome')}>
                    Maior saída
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('balance')}>
                    Maior saldo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('username')}>
                    Nome (A-Z)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" className="gap-2">
                <Download size={16} />
                Exportar
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">
                    <div 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort('username')}
                    >
                      Parceiro
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    <div 
                      className="flex items-center justify-end cursor-pointer"
                      onClick={() => handleSort('income')}
                    >
                      Entradas
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    <div 
                      className="flex items-center justify-end cursor-pointer"
                      onClick={() => handleSort('outcome')}
                    >
                      Saídas
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    <div 
                      className="flex items-center justify-end cursor-pointer"
                      onClick={() => handleSort('commission')}
                    >
                      Comissão
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    <div 
                      className="flex items-center justify-end cursor-pointer"
                      onClick={() => handleSort('bonus')}
                    >
                      Bônus
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    <div 
                      className="flex items-center justify-end cursor-pointer"
                      onClick={() => handleSort('balance')}
                    >
                      A Pagar
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-medium">
                    <span>Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(10).fill(0).map((_, i) => (
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
                        <div className="flex justify-center">
                          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-shimmer bg-[linear-gradient(90deg,theme(colors.gray.200),theme(colors.gray.100),theme(colors.gray.200))] dark:bg-[linear-gradient(90deg,theme(colors.gray.700),theme(colors.gray.600),theme(colors.gray.700))] bg-[length:200%_100%]"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredPartners.length > 0 ? (
                  filteredPartners.map((partner) => (
                    <tr 
                      key={partner.id} 
                      className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => navigate(`/partners/${partner.username}`)}
                    >
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
                        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Opções</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/partners/${partner.username}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Exportar dados
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-gray-500">
                      Nenhum parceiro encontrado com os filtros aplicados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {!isLoading && filteredPartners.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando {filteredPartners.length} de {partners.length} parceiros
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerList;
