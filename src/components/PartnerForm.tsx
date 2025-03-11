
import { useState } from "react";
import { usePartners } from "@/context/PartnerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Partner } from "@/types/partner";

interface PartnerFormProps {
  existingPartner?: Partner;
  onCancel: () => void;
}

const PartnerForm = ({ existingPartner, onCancel }: PartnerFormProps) => {
  const isEditing = !!existingPartner;
  const { addPartner, updatePartner } = usePartners();
  
  const [formData, setFormData] = useState({
    name: existingPartner?.name || "",
    username: existingPartner?.username || "",
    commission: existingPartner?.commission || 10,
    bonus: existingPartner?.bonus || 0,
    active: existingPartner?.active !== false, // default to true if not specified
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "commission" || name === "bonus") {
      setFormData(prev => ({ 
        ...prev, 
        [name]: parseFloat(value) || 0 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.username.trim()) {
      return;
    }

    if (isEditing && existingPartner) {
      updatePartner({
        ...existingPartner,
        name: formData.name,
        username: formData.username,
        commission: formData.commission,
        bonus: formData.bonus,
        active: formData.active
      });
    } else {
      addPartner({
        id: crypto.randomUUID(),
        name: formData.name,
        username: formData.username,
        commission: formData.commission,
        bonus: formData.bonus,
        transactions: [],
        clients: [], // Adding the required clients array
        active: formData.active
      });
    }
    
    onCancel();
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Parceiro" : "Adicionar Novo Parceiro"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nome do parceiro"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="@username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isEditing} // Username cannot be changed once set
            />
            <p className="text-sm text-muted-foreground">
              Ex: @tayna, @raquel
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="commission">Comissão (%)</Label>
            <Input
              id="commission"
              name="commission"
              type="number"
              placeholder="10"
              value={formData.commission}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
              required
            />
            <p className="text-sm text-muted-foreground">
              Porcentagem de comissão sobre entradas
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bonus">Bônus (R$)</Label>
            <Input
              id="bonus"
              name="bonus"
              type="number"
              placeholder="0"
              value={formData.bonus}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
            <p className="text-sm text-muted-foreground">
              Valor fixo de bônus para o parceiro
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-master-gold hover:bg-master-darkGold text-white">
            {isEditing ? "Atualizar" : "Adicionar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PartnerForm;
