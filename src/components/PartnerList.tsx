
import { useState } from "react";
import { usePartners } from "@/context/PartnerContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MoreHorizontal, Plus, PenLine, Trash2, Upload } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import PartnerForm from "./PartnerForm";
import { Partner } from "@/types/partner";
import ImportCSV from "./ImportCSV";

const PartnerList = () => {
  const { partners, getPartnerSummary, deletePartner, setSelectedPartnerId } = usePartners();
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [partnerToEdit, setPartnerToEdit] = useState<Partner | null>(null);
  const [partnerToImport, setPartnerToImport] = useState<string | null>(null);

  const handleEdit = (partner: Partner) => {
    setPartnerToEdit(partner);
  };

  const handleImport = (partnerId: string) => {
    setPartnerToImport(partnerId);
  };

  const handleCloseForm = () => {
    setIsAddingPartner(false);
    setPartnerToEdit(null);
  };

  const handleCloseImport = () => {
    setPartnerToImport(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Parceiros</CardTitle>
        <Button 
          onClick={() => setIsAddingPartner(true)}
          className="bg-master-gold hover:bg-master-darkGold text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Parceiro
        </Button>
      </CardHeader>
      <CardContent>
        {partners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-4 text-muted-foreground">Nenhum parceiro cadastrado</p>
            <Button 
              onClick={() => setIsAddingPartner(true)}
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeiro Parceiro
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead>Entradas (7d)</TableHead>
                <TableHead>Saídas (7d)</TableHead>
                <TableHead>Saldo Final</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.map((partner) => {
                const summary = getPartnerSummary(partner.id);
                return (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{partner.username}</TableCell>
                    <TableCell>{partner.commission}%</TableCell>
                    <TableCell className="text-emerald-500">
                      {formatCurrency(summary?.totalIn || 0)}
                    </TableCell>
                    <TableCell className="text-rose-500">
                      {formatCurrency(summary?.totalOut || 0)}
                    </TableCell>
                    <TableCell className={summary?.finalBalance && summary.finalBalance >= 0 ? "text-emerald-500" : "text-rose-500"}>
                      {formatCurrency(summary?.finalBalance || 0)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedPartnerId(partner.id)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleImport(partner.id)}>
                            <Upload className="mr-2 h-4 w-4" />
                            Importar CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(partner)}>
                            <PenLine className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-rose-500 focus:text-rose-500"
                            onClick={() => deletePartner(partner.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Partner Form Dialog */}
        <Dialog open={isAddingPartner || !!partnerToEdit} onOpenChange={(open) => {
          if (!open) handleCloseForm();
        }}>
          <DialogContent className="sm:max-w-[550px]">
            <PartnerForm 
              existingPartner={partnerToEdit || undefined} 
              onCancel={handleCloseForm} 
            />
          </DialogContent>
        </Dialog>

        {/* Import CSV Dialog */}
        <Dialog open={!!partnerToImport} onOpenChange={(open) => {
          if (!open) handleCloseImport();
        }}>
          <DialogContent className="sm:max-w-[550px]">
            {partnerToImport && (
              <ImportCSV partnerId={partnerToImport} onComplete={handleCloseImport} />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PartnerList;
