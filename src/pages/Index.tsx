
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BadgeDollarSign, 
  Download, 
  Upload, 
  Users, 
  Activity,
  Calendar,
  RefreshCw,
  LogOut,
  Globe
} from "lucide-react";
import ImportCSV from "@/components/ImportCSV";
import PartnerList from "@/components/PartnerList";
import Dashboard from "@/components/Dashboard";
import LoginForm from "@/components/LoginForm";
import GoogleSheetsConfig from "@/components/GoogleSheetsConfig";
import SyncStatus from "@/components/SyncStatus";
import { usePartners } from "@/context/PartnerContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isImporting, setIsImporting] = useState(false);
  const { isLoggedIn, logoutFromWebsite, syncWithGoogleSheets, downloadAllPartnersCSV } = usePartners();

  const handleSyncNow = async () => {
    await syncWithGoogleSheets();
  };

  const handleDownloadAll = async () => {
    await downloadAllPartnersCSV({
      username: 'tayna@virtual',
      password: '240798'
    });
  };

  const handleLogout = () => {
    logoutFromWebsite();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center justify-center mb-8">
            <img 
              src="/lovable-uploads/c4a89483-6a27-420d-9811-d36d4c7187bf.png" 
              alt="Master 01 ADM" 
              className="h-16 w-auto mb-4" 
            />
            <h1 className="text-3xl font-display text-master-gold">Master 01 ADM</h1>
            <p className="text-muted-foreground mt-2 text-center">
              Sistema de gerenciamento de parceiros e comissões
            </p>
          </div>
          <LoginForm onLoginSuccess={() => setActiveTab("dashboard")} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/c4a89483-6a27-420d-9811-d36d4c7187bf.png" 
              alt="Master 01 ADM" 
              className="h-10 w-auto" 
            />
            <h1 className="text-2xl font-display text-master-gold">Master 01 ADM</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSyncNow}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Sincronizar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadAll}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Atualizar Dados
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsImporting(true)}
              size="sm"
              className="flex items-center gap-1"
            >
              <Upload className="h-4 w-4" />
              Importar CSV
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center gap-1 text-rose-500"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="mb-4">
          <SyncStatus />
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight gold-gradient">Dashboard de Parceiros</h2>
          <p className="text-muted-foreground mt-2">
            Gerenciamento de parceiros com base nos últimos 7 dias
          </p>
        </div>

        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-[500px] mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="parceiros">Parceiros</TabsTrigger>
            <TabsTrigger value="importar">Importar Dados</TabsTrigger>
            <TabsTrigger value="configurar">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="parceiros" className="space-y-4">
            <PartnerList />
          </TabsContent>
          
          <TabsContent value="importar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Importar Dados CSV</CardTitle>
              </CardHeader>
              <CardContent>
                <ImportCSV />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configurar" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Virtual Club
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <p className="text-sm">Conectado</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Ações</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleDownloadAll}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Atualizar Dados
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full text-rose-500" 
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Desconectar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <GoogleSheetsConfig />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40 py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Master 01 ADM. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
