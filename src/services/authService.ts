
import { LoginCredentials } from '@/types/partner';
import { toast } from '@/hooks/use-toast';

export const login = async (credentials: LoginCredentials): Promise<boolean> => {
  try {
    // In a real implementation, you would make an actual API call to the website
    // Here we're simulating the login process
    if (credentials.username === 'tayna@virtual' && credentials.password === '240798') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('lastLogin', new Date().toISOString());
      
      toast({
        title: "Login bem-sucedido",
        description: "Você foi autenticado com sucesso.",
      });
      
      return true;
    } else {
      toast({
        title: "Falha no login",
        description: "Credenciais inválidas. Tente novamente.",
        variant: "destructive",
      });
      
      return false;
    }
  } catch (error) {
    console.error('Error during login:', error);
    
    toast({
      title: "Erro no login",
      description: "Ocorreu um erro durante a autenticação. Tente novamente mais tarde.",
      variant: "destructive",
    });
    
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('lastLogin');
  
  toast({
    title: "Logout bem-sucedido",
    description: "Você desconectou da sua conta.",
  });
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getLastLoginTime = (): string | null => {
  return localStorage.getItem('lastLogin');
};
