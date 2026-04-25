import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const MainLayout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-atlantis-white flex flex-col">
      {isAdmin && <Sidebar />}
      <Navbar />
      <main className="w-full pt-24 md:pt-32 flex-grow flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};