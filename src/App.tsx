import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Login } from './pages/public/Login';

const Home = () => <div className="min-h-screen bg-neutral-950 p-10 text-teal-400 text-2xl font-bold">Portada Pública (Landing Page)</div>;
const ClientDashboard = () => <div className="min-h-screen bg-neutral-950 p-10 text-white">Panel de Cliente: Mis Entradas y Mapa</div>;
const ArtistDashboard = () => <div className="min-h-screen bg-neutral-950 p-10 text-white">Panel de Artista: Rider y Camerinos</div>;
const StaffDashboard = () => <div className="min-h-screen bg-neutral-950 p-10 text-white">Panel de Staff: Validación y Chat</div>;
const AdminDashboard = () => <div className="min-h-screen bg-neutral-950 p-10 text-white font-bold text-3xl">Panel de Gestión Total (ADMIN)</div>;
const NotFound = () => <div className="min-h-screen bg-neutral-950 p-10 text-red-500">404 - Página no encontrada</div>;

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
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} /> 

        <Route element={<ProtectedRoute allowedRoles={['CLIENT']} />}>
          <Route path="/cliente" element={<ClientDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ARTIST']} />}>
          <Route path="/artista" element={<ArtistDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['STAFF']} />}>
          <Route path="/staff" element={<StaffDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;