import { Bell, User, Menu } from 'lucide-react';
import Button from './components/Button'; 
import UserMenu from './components/UserMenu'; 

const BASE_URL_ASSET = import.meta.env.BASE_URL;

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        {/* Título Criativo e Logo */}
        <div className="flex items-center gap-2 text-xl font-bold text-orange-700">
          <img
            key="quotefy-logo"
            src={`${BASE_URL_ASSET}logo_quotefy.png`}
            alt="Quotefy Logo"
            className="h-8 w-8 rounded-md"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/40x40/FF9933/FFFFFF?text=Logo'; }}
          />
          Quotefy
          <span className="hidden sm:inline text-sm font-normal text-gray-500 ml-2">
            Cotações Inteligentes, Negócios Eficientes.
          </span>
        </div>

        {/* Botão de Menu para Mobile */}
        <div className="ml-auto md:hidden">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </div>

        {/* Botões de Ação */}
        <nav className="hidden items-center space-x-4 md:flex ml-auto">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificações</span>
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">Perfil</span>
          </Button>         
          <UserMenu /> 
        </nav>
      </div>
    </header>
  );
};

export default Header;