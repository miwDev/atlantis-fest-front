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
      <main className="container mx-auto max-w-7xl px-12 md:px-24 pt-40 pb-24 flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};