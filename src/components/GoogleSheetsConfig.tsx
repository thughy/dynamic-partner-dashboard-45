
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePartners } from '@/context/PartnerContext';
import { updateGoogleSheetsConfig, initGoogleSheetsConfig } from '@/services/googleSheetsService';
import { GoogleSheetsConfig as GoogleSheetsConfigType } from '@/types/partner';
import { LoaderCircle, CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const GoogleSheetsConfig: React.FC = () => {
  const [config, setConfig] = useState<GoogleSheetsConfigType>(initGoogleSheetsConfig());
  const [isLoading, setIsLoading] = useState(false);
  const { syncWithGoogleSheets, refreshPartnersFromGoogleSheets } = usePartners();

  // Get current week's date range
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      updateGoogleSheetsConfig(config);
      await syncWithGoogleSheets();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    
    try {
      await refreshPartnersFromGoogleSheets();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuração do Google Sheets</CardTitle>
        <CardDescription>
          Configure a integração com o Google Sheets para sincronização automática
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-md flex items-center gap-3">
          <CalendarClock className="h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-medium">Semana Atual</p>
            <p className="text-xs text-muted-foreground">
              {format(monday, "dd 'de' MMMM", { locale: ptBR })} - {format(sunday, "dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spreadsheetId">ID da Planilha</Label>
            <Input
              id="spreadsheetId"
              type="text"
              value={config.spreadsheetId}
              onChange={(e) => setConfig({ ...config, spreadsheetId: e.target.value })}
              placeholder="1example-spreadsheet-id"
              required
            />
            <p className="text-xs text-muted-foreground">
              O ID pode ser encontrado na URL da sua planilha do Google Sheets
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sheetId">ID da Aba</Label>
            <Input
              id="sheetId"
              type="number"
              value={config.sheetId.toString()}
              onChange={(e) => setConfig({ ...config, sheetId: parseInt(e.target.value) || 0 })}
              placeholder="0"
              required
            />
            <p className="text-xs text-muted-foreground">
              0 para a primeira aba, 1 para a segunda, etc.
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="flex-1 bg-master-gold hover:bg-master-darkGold text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar e Sincronizar'
              )}
            </Button>
            <Button 
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                  Atualizando...
                </>
              ) : (
                'Atualizar Dados'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Os dados são sincronizados semanalmente (segunda a domingo)
        </p>
      </CardFooter>
    </Card>
  );
};

export default GoogleSheetsConfig;
