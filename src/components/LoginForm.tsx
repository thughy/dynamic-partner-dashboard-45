
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePartners } from '@/context/PartnerContext';
import { LoginCredentials } from '@/types/partner';
import { LoaderCircle } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: 'tayna@virtual',
    password: '240798'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { loginToWebsite, importPartnersFromWebsite } = usePartners();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await loginToWebsite(credentials);
      
      if (success) {
        // Import partners after successful login
        await importPartnersFromWebsite(credentials);
        
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login Virtual Club</CardTitle>
        <CardDescription>
          Entre com suas credenciais para acessar o dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuário</Label>
            <Input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="tayna@virtual"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="●●●●●●●●"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-master-gold hover:bg-master-darkGold text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Essas credenciais são usadas para acessar o site Virtual Club
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
