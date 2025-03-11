
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Upload } from "lucide-react";
import { Client, Partner } from "@/types/partner";
import { usePartners } from "@/context/PartnerContext";
import { formatDate } from "@/lib/utils";

interface ClientListProps {
  partnerId: string;
}

const ClientList = ({ partnerId }: ClientListProps) => {
  const { partners, importClientsForPartner, addClientToPartner } = usePartners();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    login: "",
    name: "",
    active: true
  });

  const partner = partners.find((p) => p.id === partnerId);
  
  if (!partner) return <div>Parceiro não encontrado</div>;

  const filteredClients = partner.clients?.filter((client) => 
    client.login.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.name && client.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleAddClient = () => {
    if (!newClient.login) return;
    
    addClientToPartner(partnerId, {
      id: `client-${Date.now()}`,
      partnerId,
      login: newClient.login,
      name: newClient.name || "",
      active: true,
      lastTransaction: "",
      balance: 0,
      notes: ""
    });
    
    setNewClient({ login: "", name: "", active: true });
    setShowAddClient(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Clientes ({filteredClients.length})</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAddClient(!showAddClient)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {showAddClient && (
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="font-medium">Adicionar Novo Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Login/@ do Cliente</label>
                  <Input
                    placeholder="@cliente"
                    value={newClient.login}
                    onChange={(e) => setNewClient({ ...newClient, login: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Nome (Opcional)</label>
                  <Input
                    placeholder="Nome do cliente"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddClient(false)}>Cancelar</Button>
                <Button onClick={handleAddClient}>Adicionar Cliente</Button>
              </div>
            </div>
          )}

          {filteredClients.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Login/@</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Última Transação</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.login}</TableCell>
                      <TableCell>{client.name || "—"}</TableCell>
                      <TableCell>
                        {client.lastTransaction 
                          ? formatDate(client.lastTransaction)
                          : "Sem transações"}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          client.active 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {client.active ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p>Nenhum cliente encontrado.</p>
              {searchTerm && <p className="text-sm">Tente ajustar sua busca ou adicione um novo cliente.</p>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientList;
