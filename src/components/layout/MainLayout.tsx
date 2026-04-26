import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useUIStore } from '../../store/uiStore';
import logoClaro from '../../assets/logo-light.svg';
import logoOscuro from '../../assets/logo-dark.svg';

export const MainLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { toggleSidebar, isSidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-atlantis-white flex flex-col">
      {isAdmin && <Sidebar />}
      {isAdmin && (
        <div className="fixed top-0 left-0 w-full z-[110] flex items-center px-6 md:px-8 py-4 pointer-events-none">
          <div className="flex items-center gap-6 md:gap-8 pointer-events-auto">
            <img 
              src={isSidebarOpen ? logoOscuro : logoClaro} 
              alt="Atlantis Logo" 
              className="h-16 w-16 md:h-20 md:w-20 object-contain transition-opacity duration-500"
            />
            <button
              onClick={toggleSidebar}
              className="flex flex-col gap-1.5 group transition-all duration-500 w-10 p-2"
            >
              <div className={`w-6 h-0.5 transition-colors duration-500 ${isSidebarOpen ? 'bg-atlantis-white' : 'bg-atlantis-bg-main'} group-hover:bg-atlantis-primary`} />
              <div className={`w-6 h-0.5 transition-colors duration-500 ${isSidebarOpen ? 'bg-atlantis-white' : 'bg-atlantis-bg-main'} group-hover:bg-atlantis-primary`} />
              <div className={`w-6 h-0.5 transition-colors duration-500 ${isSidebarOpen ? 'bg-atlantis-white' : 'bg-atlantis-bg-main'} group-hover:bg-atlantis-primary`} />
            </button>
          </div>
        </div>
      )}
      {!isAdmin && <Navbar />}
      <main className="w-full pt-24 md:pt-32 flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};