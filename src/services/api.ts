import axios from 'axios';
import type { AxiosRequestConfig, AxiosError} from 'axios'; 

let onTokenExpiredCallback: (() => void) | null = null;
export let currentAccessToken: string | null = null; 
let currentRefreshToken: string | null = null; 

const BASE_URL = 'http://localhost:8080';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
    currentAccessToken = accessToken;
    currentRefreshToken = refreshToken;

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

export const clearAuthTokens = () => {
    currentAccessToken = null;
    currentRefreshToken = null;
    delete api.defaults.headers.common['Authorization'];
};

export const registerTokenExpiredCallback = (callback: () => void) => {
    onTokenExpiredCallback = callback;
};


let isRefreshing = false;
let failedQueue: Array<{ 
    resolve: (value: unknown) => void; 
    reject: (reason?: unknown) => void; 
    originalRequest: AxiosRequestConfig; 
}> = [];

const processQueue = (error: AxiosError | Error | null, token: string | null = null) => {
    const err = error as AxiosError | null; 

    failedQueue.forEach(prom => {
        if (err) {
            // Se houver erro, rejeita a promise
            prom.reject(err);
        } else if (token) {
            // Se o refresh funcionou, repete a requisição original com o novo token
            prom.resolve(api(prom.originalRequest));
        }
    });
    failedQueue = [];
};


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
  
        if (error.response?.status === 401 && originalRequest.url !== '/auth/refresh') {
            
            if (isRefreshing) { 
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject, originalRequest });
                });
            }

            isRefreshing = true;

            try {
                const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refreshToken: currentRefreshToken,
                });

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;                

                setAuthTokens(newAccessToken, newRefreshToken);
                
                processQueue(null, newAccessToken);

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) { 
                const errorToProcess = refreshError as AxiosError;
                
                clearAuthTokens();
                processQueue(errorToProcess); 
                
                if (onTokenExpiredCallback) {
                    onTokenExpiredCallback(); 
                }
                return Promise.reject(errorToProcess);

            } finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(error);
    }
);