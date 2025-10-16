// src/components/ProtectedRoute.tsx

import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // Caminho corrigido

interface ProtectedRouteProps {
  allowedRoles?: Array<'admin' | 'user' | 'vendor'>; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthReady(true);
    }, 50); 
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthReady) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
        return; 
      }

      if (allowedRoles && user) {
        const isAllowed = allowedRoles.includes(user.role);
        
        if (!isAllowed) {
          console.warn(`Acesso negado: Usuário ${user.role} tentou acessar rota restrita.`);
          navigate('/', { replace: true });
        }
      }
    }
  }, [isAuthReady, isAuthenticated, user, allowedRoles, navigate]);


  if (!isAuthReady) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="animate-spin text-blue-500 h-10 w-10" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;