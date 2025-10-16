// src/components/UserMenu.tsx

import { LogOut, User } from 'lucide-react';
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from './Button'; // Assumindo que o componente Button está disponível

const UserMenu: React.FC = () => {
    const { user, logout } = useAuth();

    if (!user) {
        // Isso não deve acontecer dentro do MainLayout, mas é uma salvaguarda.
        return null; 
    }

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                    <User className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role === 'admin' ? 'Administrador' : user.role}</p>
                </div>
            </div>
            
            <Button 
                onClick={logout} 
                variant="outline"
                className="flex items-center gap-1 text-red-600 hover:bg-red-50/50 border-red-200"
            >
                <LogOut className="h-4 w-4" />
                Sair
            </Button>
        </div>
    );
};

export default UserMenu;