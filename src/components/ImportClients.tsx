
import { useState, useRef } from "react";
import { usePartners } from "@/context/PartnerContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportClientsProps {
  partnerId?: string;
  onComplete?: () => void;
}

const ImportClients = ({ partnerId, onComplete }: ImportClientsProps) => {
  const { partners, importClientsForPartner } = usePartners();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partnerId || "");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handlePartnerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPartnerId(e.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedPartnerId) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo e um parceiro",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          importClientsForPartner(selectedPartnerId, event.target.result);
          
          // Reset form
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          
          if (onComplete) {
            onComplete();
          }
        }
      };
      
      reader.readAsText(selectedFile);
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Erro",
        description: "Falha ao ler o arquivo CSV.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Importar Lista de Clientes (CSV)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!partnerId && (
          <div className="space-y-2">
            <label htmlFor="partner" className="block text-sm font-medium">
              Selecione o Parceiro
            </label>
            <select
              id="partner"
              className="w-full px-3 py-2 border rounded-md"
              value={selectedPartnerId}
              onChange={handlePartnerChange}
              disabled={isLoading}
            >
              <option value="">Selecione um parceiro</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name} ({partner.username})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="csv-file" className="block text-sm font-medium">
            Arquivo CSV
          </label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isLoading}
              className="flex-1"
            />
          </div>
          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </div>
          )}
        </div>

        <div className="rounded-md bg-muted p-3 text-sm">
          <p className="font-medium">Formato Esperado do CSV:</p>
          <p className="text-muted-foreground mt-1">
            login,nome,status
          </p>
          <p className="text-muted-foreground">
            @cliente1,Nome Cliente 1,ativo
          </p>
          <p className="text-muted-foreground">
            @cliente2,Nome Cliente 2,inativo
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !selectedPartnerId || isLoading}
          className="w-full bg-master-gold hover:bg-master-darkGold text-white"
        >
          {isLoading ? (
            "Importando..."
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Importar Clientes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImportClients;
