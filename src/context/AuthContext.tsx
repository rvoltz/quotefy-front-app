import { useState, useEffect, useCallback, useMemo, useRef } from 'react'; // 👈 Adicionado useRef
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth-types';
import type { User } from './auth-types';

import { 
    api, 
    setAuthTokens, 
    clearAuthTokens, 
    registerTokenExpiredCallback,
} from '../services/api'; 

const REFRESH_BEFORE_EXPIRY = 30000; // 5 minutos em milissegundos

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    tenantId: string | null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    
    // 1. ESTADO DE AUTENTICAÇÃO
    const [authState, setAuthState] = useState<AuthState>(() => {
        return { user: null, accessToken: null, refreshToken: null, tenantId: null };
    });
    
    // 2. REFÊNCIA DO TIMER ID (Substituindo useState por useRef)
    // O tipo é 'number' para browser setTimeout ID.
    const refreshTimerRef = useRef<number | null>(null);

    const navigate = useNavigate();
    const isAuthenticated = !!authState.user && !!authState.accessToken;

    
    // --- LÓGICA DE LOGOUT (Estável) ---
    const logout = useCallback(() => {      
        // Limpa o timer diretamente usando a ref
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }
        refreshTimerRef.current = null; // Reinicia a referência
        
        clearAuthTokens();
        setAuthState({ user: null, accessToken: null, refreshToken: null, tenantId: null });
        navigate('/login');
    }, [navigate]); 

    
    // --- FUNÇÃO PARA PEGAR NOVO TOKEN (Estável) ---
    const handleProactiveRefresh = useCallback(async () => {
        if (!authState.refreshToken || !authState.tenantId) {
            console.warn("Sem refresh token para renovar. Fazendo logout.");
            logout();
            return;
        }

        try {
             const response = await api.post('/auth/refresh', { 
                refreshToken: authState.refreshToken,
                tenantId: authState.tenantId
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data;
            
            setAuthTokens(accessToken, newRefreshToken);
            
            // Dispara o useEffect de agendamento novamente
            setAuthState(prev => ({ 
                ...prev, 
                accessToken, 
                refreshToken: newRefreshToken || prev.refreshToken
            }));

            console.log("Token JWT renovado com sucesso (proativo).");

        } catch (error) {
            console.error("Falha no refresh proativo. Forçando logout." + error);
            logout();
        }
    }, [authState.refreshToken, authState.tenantId, logout]);

    
    // --- LÓGICA DE LOGIN (Estável) ---
    const login = useCallback(async (email: string, password: string, tenantId: string = "techcorp"): Promise<boolean> => {
        try {
            const response = await api.post('/auth/login', { email, password, tenantId });
            
            const { accessToken, refreshToken } = response.data;
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            
            const loggedUser: User = { 
                id: payload.userId || 'unknown',
                name: payload.sub.split('@')[0],
                email: payload.sub, 
                role: payload.roles && payload.roles.length > 0 ? payload.roles[0] : 'user'
            };

            setAuthTokens(accessToken, refreshToken);
            setAuthState({ user: loggedUser, accessToken, refreshToken, tenantId });
            navigate('/');
            return true;

        } catch (error) {
            console.error("Login failed:", error);
            clearAuthTokens();
            setAuthState({ user: null, accessToken: null, refreshToken: null, tenantId: null });
            return false;
        }
    }, [navigate]);

    
    // A) Registro do Callback
    useEffect(() => {
        registerTokenExpiredCallback(logout);
    }, [logout]);


    // B) AGENDAMENTO DO TIMER
    useEffect(() => {
        const token = authState.accessToken;
        
        // 1. Limpa o timer anterior antes de configurar um novo (usando a referência)
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }
        // Se não houver token, garantimos que a ref esteja nula
        refreshTimerRef.current = null;
        
        if (token) {
            try {
                // Lógica de cálculo de tempo
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expTimeSeconds = payload.exp; 
                
                const expTimeMs = expTimeSeconds * 1000;
                const nowTimeMs = Date.now();
                const timeToRefresh = expTimeMs - nowTimeMs - REFRESH_BEFORE_EXPIRY;
                
                if (timeToRefresh > 0) {
                    const timer = setTimeout(() => {
                        handleProactiveRefresh();
                    }, timeToRefresh);
                    
                    refreshTimerRef.current = timer as number; 
                } else {
                     handleProactiveRefresh();
                }
            } catch (error) {
                console.error("Erro ao decodificar JWT para agendar refresh.", error);
                logout();
            }
        }

        // FUNÇÃO DE CLEANUP: Roda antes do próximo efeito ou no unmount.
        return () => {
             // Limpa o timer final usando a ref
             if (refreshTimerRef.current) { 
                 clearTimeout(refreshTimerRef.current); 
             }
        };

    // Dependências: Não inclui a ref, apenas o gatilho e as funções estáveis
    }, [authState.accessToken, handleProactiveRefresh, logout]); 


    // --- 6. EXPOSIÇÃO DO CONTEXTO (Estável com useMemo) ---
    const value = useMemo(() => ({
        user: authState.user,
        isAuthenticated,
        login,
        logout,
    }), [authState.user, isAuthenticated, login, logout]);


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};