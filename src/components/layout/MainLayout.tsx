import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-atlantis-white">
      <Sidebar />
      <Navbar />
      <main className="container mx-auto px-8 pt-32 pb-12">
        <Outlet />
      </main>
    </div>
  );
};