import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

export const Sidebar = () => {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Festival', path: '/admin' },
    { label: 'Artistas', path: '/admin/artistas' },
    { label: 'Clientes', path: '/admin/clientes' },
    { label: 'Staff', path: '/admin/staff' },
    { label: 'FoodTrucks', path: '/admin/foodtruck' },
    { label: 'Zonas', path: '/admin/zonas' },
    { label: 'Tickets', path: '/admin/tickets' },
    { label: 'Conciertos', path: '/admin/conciertos' },
  ];

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-atlantis-bg-main/60 backdrop-blur-sm z-[100]"
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 left-0 h-screen w-full md:w-80 bg-atlantis-primary z-[105] flex flex-col p-8 pt-32 justify-between"
          >
            <nav className="flex flex-col gap-8">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`text-left font-plex text-sm font-black uppercase tracking-[0.2em] transition-colors ${
                    location.pathname === item.path ? 'text-atlantis-white' : 'text-atlantis-white/60 hover:text-atlantis-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            
            <button
              onClick={handleLogout}
              className="text-left font-plex text-sm font-black uppercase tracking-[0.2em] text-atlantis-white/60 hover:text-atlantis-error transition-colors mt-auto mb-8"
            >
              Cerrar Sesión
            </button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};