import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Login } from './pages/public/Login';
import { Landing } from './pages/public/Landing';
import { MainLayout } from './components/layout/MainLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ArtistsPage } from './pages/admin/ArtistsPage';
import { ClientsPage } from './pages/admin/ClientsPage';

const ClientDashboard = () => <div className="min-h-screen bg-atlantis-white p-10 text-atlantis-bg-main font-syne font-bold">Panel de Cliente: Mis Entradas y Mapa</div>;

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          
          <Route path="/" element={<Landing />} />
          
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/artistas" element={<ArtistsPage />} />
            <Route path="/admin/clientes" element={<ClientsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
            <Route path="/cliente" element={<ClientDashboard />} />
          </Route>
          
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;