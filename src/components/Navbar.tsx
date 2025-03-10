
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  UploadCloud, 
  LogOut,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Parceiros', href: '/partners', icon: <Users className="w-5 h-5" /> },
    { name: 'Importar CSV', href: '/import', icon: <UploadCloud className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-master-black text-white transform transition-transform duration-300 ease-in-out",
          isMobile && !mobileMenuOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 p-4">
            <img 
              src="/lovable-uploads/c4a89483-6a27-420d-9811-d36d4c7187bf.png" 
              alt="MASTER01 Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          
          <Separator className="bg-master-gray/50" />
          
          {/* Nav Items */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={isMobile ? closeMobileMenu : undefined}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md transition-all duration-200 group",
                  isActive(item.href)
                    ? "bg-master-gray text-master-gold"
                    : "text-gray-300 hover:bg-master-lightGray hover:text-master-gold"
                )}
              >
                <span className="mr-3 flex-shrink-0">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
                {isActive(item.href) && (
                  <span className="ml-auto w-1 h-6 bg-master-gold rounded-full"/>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 space-y-2">
            <Button 
              variant="outline" 
              onClick={toggleDarkMode}
              className="w-full justify-start border-master-gray/50 hover:bg-master-lightGray hover:text-master-gold"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 mr-2" />
              ) : (
                <Moon className="w-4 h-4 mr-2" />
              )}
              {darkMode ? 'Modo Claro' : 'Modo Escuro'}
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start border-master-gray/50 hover:bg-master-lightGray hover:text-master-gold"
              onClick={() => {
                // Handle logout logic
                if(isMobile) {
                  closeMobileMenu();
                }
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-master-black h-16 flex items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-master-lightGray"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
          
          <img 
            src="/lovable-uploads/c4a89483-6a27-420d-9811-d36d4c7187bf.png" 
            alt="MASTER01 Logo" 
            className="h-10 w-auto object-contain"
          />
          
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      )}

      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Main Content Container */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300 bg-gradient-to-b from-white to-gray-100 dark:from-master-black dark:to-master-gray",
          isMobile ? "pt-16 pl-0" : "pl-64"
        )}
      >
        {/* Content will be rendered here */}
      </main>
    </>
  );
};

export default Navbar;
