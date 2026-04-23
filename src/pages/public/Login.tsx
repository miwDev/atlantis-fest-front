import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/api';
import { useAuthStore } from '../../store/authStore';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();


  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/authorizations/login', {
        username: username,
        password: password
      });

      const token = response.data.token;
      
      const user = { id: '1', name: 'Admin', role: 'ADMIN' as const };

      login(user, token);

      navigate('/admin');

    } catch{
      setError('Credenciales incorrectas. Revisa tu usuario y contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Acceso <span className="text-teal-400">Atlantis</span>
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-2">Usuario</label>
            <input
              type="text"
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-2">Contraseña</label>
            <input
              type="password"
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold py-3 rounded-lg mt-4 disabled:opacity-50"
          >
            {isLoading ? 'Conectando...' : 'Entrar'}
          </button>

        </form>
      </div>
    </div>
  );
};