// src/pages/LoginPage.tsx

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth'; 

const LoginPage = () => {
  const auth = useAuth();
    
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    setIsLoading(true);

    try {
        const success = await auth.login(email, password, "techcorp"); 

        if (!success) {
            setError('Credenciais inválidas. Verifique seu e-mail e senha.');
        } else {
            console.log('Login bem-sucedido. Redirecionando...');
        }
    } catch (err) {
        setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
        console.error("Login error:", err);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-blue-600">Quotefy</h1>
            <p className="text-sm text-gray-500 mt-2">
              Faça login para acessar o painel de cotações.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Quotefy. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;