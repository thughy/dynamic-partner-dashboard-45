
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
  Calendar
} from "lucide-react";
import ImportCSV from "@/components/ImportCSV";
import PartnerList from "@/components/PartnerList";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isImporting, setIsImporting] = useState(false);

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
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsImporting(true)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importar CSV
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight gold-gradient">Dashboard de Parceiros</h2>
          <p className="text-muted-foreground mt-2">
            Gerenciamento de parceiros com base nos últimos 7 dias
          </p>
        </div>

        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-[400px] mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="parceiros">Parceiros</TabsTrigger>
            <TabsTrigger value="importar">Importar Dados</TabsTrigger>
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
