import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react';
import logoClaro from '../../assets/logo-light.svg';
import loginBG from '../../assets/LoginBG.png'; 
import api from '../../config/api'; 

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'CLIENT') navigate('/cliente');
      else if (user.role === 'ARTIST') navigate('/artista');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(''); 

    if (!username || !password) {
      setErrorMsg('Por favor, rellena todos los campos.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/authorizations/login', { username, password });
      const data = response.data;

      const realUser = {
        id: String(data.id), 
        name: data.username,
        role: data.role.replace('ROLE_', '') as "CLIENT" | "ARTIST" | "STAFF" | "ADMIN", 
        email: data.email
      };

      await login(realUser, data.token); 
      if (realUser.role === 'ADMIN') navigate('/admin');
      else if (realUser.role === 'CLIENT') navigate('/cliente');
      else if (realUser.role === 'ARTIST') navigate('/artista');
      else navigate('/');
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Credenciales incorrectas.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden font-plex bg-atlantis-white">
      
      {/* SECCIÓN IZQUIERDA: IMAGEN */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden lg:block lg:w-[70%] relative overflow-hidden"
      >
        <img 
          src={loginBG} 
          alt="Atlantis Experience" 
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
        />
        <div className="absolute inset-0 bg-atlantis-bg-alt/10 mix-blend-multiply" />
      </motion.div>

      {/* SECCIÓN DERECHA: LOGIN CON VARIABLES OFICIALES */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-[30%] flex flex-col justify-center p-8 md:p-16 bg-atlantis-white z-10 border-l border-atlantis-secondary/20"
      >
        <div className="max-w-sm mx-auto w-full space-y-12">
          
          <div className="space-y-6">
            <img src={logoClaro} alt="Logo" className="h-12 w-12" />
            <div className="space-y-1">
              <h2 className="font-syne text-h4 font-bold uppercase tracking-tighter text-atlantis-bg-main">
                Identificación
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-atlantis-secondary">
                Identificador
              </label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-b border-atlantis-secondary/30 py-3 font-medium text-atlantis-bg-main focus:border-atlantis-primary outline-none transition-colors rounded-none bg-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-atlantis-secondary">
                Clave
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-atlantis-secondary/30 py-3 font-medium text-atlantis-bg-main focus:border-atlantis-primary outline-none transition-colors rounded-none bg-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-atlantis-secondary hover:text-atlantis-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-[10px] font-bold text-atlantis-error uppercase tracking-widest">
                {errorMsg}
              </p>
            )}

            <div className="pt-6 space-y-6">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-atlantis-bg-main text-atlantis-white font-bold p-4 uppercase tracking-[0.2em] hover:bg-atlantis-primary transition-colors duration-300 rounded-none"
              >
                {isLoading ? 'Accediendo...' : 'Acceder'}
              </button>

              <div className="text-center flex flex-col items-center gap-6">
                <a 
                  href="#To be implemented" 
                  className="text-[10px] font-bold text-atlantis-secondary uppercase tracking-widest hover:text-atlantis-bg-main transition-colors"
                >
                  ¿Has olvidado tu contraseña?
                </a>

                <button 
                  onClick={() => navigate('/')}
                  type="button"
                  className="relative group inline-flex items-center gap-2 text-[10px] font-bold text-atlantis-secondary uppercase tracking-widest hover:text-atlantis-bg-main transition-colors"
                >
                  <span>←</span> Volver a la portada
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-atlantis-bg-main transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};