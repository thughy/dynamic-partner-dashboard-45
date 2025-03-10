
import { usePartners } from "@/context/PartnerContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Calendar, Users, BadgePercent, Award, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PartnerList from "./PartnerList";
import PartnerDetail from "./PartnerDetail";

const Dashboard = () => {
  const { partners, selectedPartnerId, getAllPartnerSummaries, getTotalSummary } = usePartners();

  const totalSummary = getTotalSummary();
  const partnerSummaries = getAllPartnerSummaries();

  // Sort partners by final balance
  const sortedPartners = [...partnerSummaries].sort((a, b) => b.finalBalance - a.finalBalance);
  const topPartners = sortedPartners.slice(0, 5);

  return (
    <div className="space-y-6">
      {selectedPartnerId ? (
        <PartnerDetail />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
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
            
            <Card>
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
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Comissões (7d)
                </CardTitle>
                <BadgePercent className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {formatCurrency(totalSummary.totalCommission)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Últimos 7 dias
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Parceiros Ativos
                </CardTitle>
                <Users className="h-4 w-4 text-master-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {partners.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de parceiros
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumo da Semana</CardTitle>
                <CardDescription>
                  Visão geral dos últimos 7 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <div className="text-sm text-muted-foreground">Entradas Totais</div>
                        <div className="text-lg font-semibold text-emerald-500">{formatCurrency(totalSummary.totalIn)}</div>
                      </div>
                      <div className="col-span-1">
                        <div className="text-sm text-muted-foreground">Saídas Totais</div>
                        <div className="text-lg font-semibold text-rose-500">{formatCurrency(totalSummary.totalOut)}</div>
                      </div>
                      <div className="col-span-1">
                        <div className="text-sm text-muted-foreground">Saldo Final</div>
                        <div className={`text-lg font-semibold ${totalSummary.totalFinalBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {formatCurrency(totalSummary.totalFinalBalance)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Comissões por Parceiro</div>
                    <div className="space-y-2">
                      {partnerSummaries.map((summary) => (
                        <div 
                          key={summary.id} 
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-2">
                            <BadgePercent className="h-4 w-4 text-orange-500" />
                            <span>{summary.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {summary.username}
                            </span>
                          </div>
                          <div className="text-sm font-medium">
                            {formatCurrency(summary.commissionValue)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Total de Comissões</div>
                        <div className="text-lg font-semibold">{formatCurrency(totalSummary.totalCommission)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total de Bônus</div>
                        <div className="text-lg font-semibold">{formatCurrency(totalSummary.totalBonus)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Parceiros</CardTitle>
                <CardDescription>
                  Parceiros com maior saldo final nos últimos 7 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPartners.map((partner, index) => (
                    <div 
                      key={partner.id} 
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{partner.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {partner.username}
                          </p>
                        </div>
                      </div>
                      <div className={`text-sm font-semibold ${partner.finalBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {formatCurrency(partner.finalBalance)}
                      </div>
                    </div>
                  ))}
                  
                  {partners.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground">Nenhum parceiro cadastrado</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Parceiros</CardTitle>
              <CardDescription>
                Gerenciar parcerias e visualizar resumos de 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PartnerList />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
