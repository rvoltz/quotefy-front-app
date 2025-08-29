import { Link } from 'react-router-dom';
import { ReceiptText, Car, Wrench, Users, Group } from 'lucide-react';
import Sheet from './components/Sheet'; // Importa o Sheet do novo caminho

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isMobileOpen, onClose }: SidebarProps) => {
  const navItems = [
    { name: 'Cotações', icon: ReceiptText, path: '/cotacoes' },
    { name: 'Veículos', icon: Car, path: '/veiculos' },
    { name: 'Peças', icon: Wrench, path: '/pecas' },
    { name: 'Fornecedores', icon: Users, path: '/fornecedores' },
    { name: 'Grupos de Fornecedores', icon: Group, path: '/grupos-fornecedores' },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-4">
        <nav className="grid gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-700 transition-colors md:justify-center md:px-2"
              title={item.name}
            >
              <item.icon className="h-5 w-5" />
              <span className="md:hidden">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar para desktop */}
      <aside className="hidden md:block w-20 border-r bg-gray-50 h-screen sticky top-0 transition-all duration-300 ease-in-out hover:w-48">
        {sidebarContent}
      </aside>

      {/* Sheet (Drawer) para mobile */}
      <Sheet open={isMobileOpen} onClose={onClose}>
        {/* Conteúdo do sidebar para mobile (completo) */}
        <div className="flex h-full flex-col justify-between p-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-orange-700 mb-4">Navegação</h2>
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-700 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </Sheet>
    </>
  );
};

export default Sidebar;