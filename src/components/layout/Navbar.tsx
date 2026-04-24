import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import logoClaro from '../../assets/logo-light.svg';
import logoOscuro from '../../assets/logo-dark.svg';

export const Navbar = () => {
  const { isNavbarOpen, isSidebarOpen, toggleNavbar, toggleSidebar, closeAll } = useUIStore();
  
  // Traemos el estado de autenticación y funciones del Zustand
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Opciones dinámicas según el rol
  let menuOptions: string[] = [];
  if (!isAuthenticated) {
    menuOptions = ['Tickets', 'Lineup', 'Recinto'];
  } else if (user?.role === 'ADMIN') {
    menuOptions = []; // Por definir más adelante
  } else if (user?.role === 'CLIENT') {
    menuOptions = []; // Por definir más adelante
  } else {
    menuOptions = [];
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDarkBg = isNavbarOpen || isSidebarOpen;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[110] flex justify-between items-center px-6 md:px-8 py-4 pointer-events-none">
        
        {/* IZQUIERDA: Logo y Hamburguesa */}
        <div className="flex items-center gap-6 md:gap-8 pointer-events-auto">
          {/* Logo */}
          <img 
            src={isDarkBg ? logoOscuro : logoClaro} 
            alt="Atlantis Logo" 
            className="h-16 w-16 md:h-20 md:w-20 object-contain transition-opacity duration-500"
          />

          {/* Hamburger (Solo en Admin) */}
          {isAdmin && (
            <button
              onClick={toggleSidebar}
              className={`flex flex-col gap-1.5 group transition-all duration-500 overflow-hidden ${
                isNavbarOpen ? 'w-0 opacity-0 p-0 pointer-events-none' : 'w-10 opacity-100 p-2 pointer-events-auto'
              }`}
            >
              <div className={`w-6 h-0.5 transition-colors duration-500 ${isDarkBg ? 'bg-atlantis-white' : 'bg-atlantis-bg-main'} group-hover:bg-atlantis-primary`} />
              <div className={`w-6 h-0.5 transition-colors duration-500 ${isDarkBg ? 'bg-atlantis-white' : 'bg-atlantis-bg-main'} group-hover:bg-atlantis-primary`} />
              <div className={`w-6 h-0.5 transition-colors duration-500 ${isDarkBg ? 'bg-atlantis-white' : 'bg-atlantis-bg-main'} group-hover:bg-atlantis-primary`} />
            </button>
          )}
        </div>

        {/* DERECHA: + MENÚ */}
        <div className="flex justify-end pointer-events-auto">
          <button
            onClick={toggleNavbar}
            className={`font-plex text-sm uppercase tracking-widest transition-colors duration-500 overflow-hidden h-6 flex items-center ${
              isDarkBg ? 'text-atlantis-white' : 'text-atlantis-bg-main hover:text-atlantis-primary'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isNavbarOpen ? 'close' : 'menu'}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="block font-bold"
              >
                {isNavbarOpen ? '— CERRAR' : '+ MENÚ'}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* LA CORTINA DESPLEGABLE AZUL KLEIN */}
      <div
        className={`fixed top-0 left-0 w-full bg-atlantis-primary flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] z-[100] shadow-2xl ${
          isNavbarOpen ? 'h-[35vh] opacity-100' : 'h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className={`flex flex-col items-center space-y-4 transition-all duration-700 delay-150 ${
            isNavbarOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {menuOptions.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                // Aquí iría la navegación a la sección correspondiente
                toggleNavbar();
              }}
              className="font-syne text-h4 font-bold text-atlantis-white hover:opacity-60 transition-opacity duration-300 uppercase tracking-tighter"
            >
              {item}
            </button>
          ))}
        </div>

        {/* BOTÓN INFERIOR DERECHO (Cerrar Sesión o Acceder) */}
        <div 
          className={`absolute bottom-6 right-6 md:bottom-10 md:right-10 transition-all duration-700 delay-300 ${
            isNavbarOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="font-syne text-h6 md:text-h6 font-bold text-atlantis-white hover:text-atlantis-error transition-colors duration-300 uppercase tracking-tighter"
            >
              Cerrar Sesión
            </button>
          ) : (
            <button
              onClick={() => {
                toggleNavbar();
                navigate('/login');
              }}
              className="font-syne text-h6 md:text-h6 font-bold text-atlantis-white hover:text-atlantis-bg-main transition-colors duration-300 uppercase tracking-tighter"
            >
              Acceder
            </button>
          )}
        </div>
      </div>

      <div 
        onClick={closeAll}
        className={`fixed inset-0 bg-atlantis-bg-alt/30 backdrop-blur-sm transition-opacity duration-500 z-[90] ${
          isNavbarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
    </>
  );
};