// src/context/auth-context-def.ts

import { createContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'vendor'; 
}

export interface AuthContextType { 
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, tenantId: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);