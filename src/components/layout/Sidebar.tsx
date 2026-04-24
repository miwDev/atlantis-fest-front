import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';

export const Sidebar = () => {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Overview', path: '/admin' },
    { label: 'Entradas', path: '/admin/tickets' },
    { label: 'Usuarios', path: '/admin/users' },
    { label: 'Sistema', path: '/admin/settings' },
  ];

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-atlantis-bg-main/60 backdrop-blur-sm z-[100]"
          />

          {/* SIDEBAR */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 left-0 h-screen w-full md:w-80 bg-atlantis-primary z-[105] flex flex-col p-8 pt-32"
          >
            {/* OPCIONES DE MENÚ */}
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};