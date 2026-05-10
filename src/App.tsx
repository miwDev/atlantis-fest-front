import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Login } from './pages/public/Login';
import { Landing } from './pages/public/Landing';
import { MainLayout } from './components/layout/MainLayout';

import { ArtistsPage } from './pages/admin/ArtistsPage';
import { ClientsPage } from './pages/admin/ClientsPage';
import { StaffPage } from './pages/admin/StaffPage';
import { FestivalPage } from './pages/admin/FestivalPage';
import { ZonesPage } from './pages/admin/ZonesPage';
import { TicketsPage } from './pages/admin/TicketsPage';
import { ConcertsPage } from './pages/admin/ConcertsPage';
import { FoodtrucksPage } from './pages/admin/FoodtrucksPage';
import { LegalPage } from './pages/public/LegalPage';
import { FaqsPage } from './pages/public/FaqsPage';
import { PublicTicketsPage } from './pages/public/PublicTicketsPage';
import { CheckoutPage } from './pages/public/CheckoutPage';
import { SuccessPage } from './pages/public/SuccessPage';
import { ClientPersonalPage } from './pages/public/ClientPersonalPage';
import { ArtistAgendaPage } from './pages/public/ArtistAgendaPage';
import { ArtistProfilePage } from './pages/public/ArtistProfilePage';
import { StaffPersonalPage } from './pages/public/StaffPersonalPage';
import { FoodtruckPersonalPage } from './pages/public/FoodtruckPersonalPage';




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
          <Route path="/tickets" element={<PublicTicketsPage />} />
          <Route path="/checkout/:ticketTypeId" element={<CheckoutPage />} />
          <Route path="/purchase-success" element={<SuccessPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/info" element={<FaqsPage />} />
          
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<FestivalPage />} />
            <Route path="/admin/artistas" element={<ArtistsPage />} />
            <Route path="/admin/clientes" element={<ClientsPage />} />
            <Route path="/admin/staff" element={<StaffPage />} />
            <Route path="/admin/foodtruck" element={<FoodtrucksPage />} />
            <Route path="/admin/zonas" element={<ZonesPage />} />
            <Route path="/admin/tickets" element={<TicketsPage />} />
            <Route path="/admin/conciertos" element={<ConcertsPage />} />
          </Route>

          <Route path="/cliente" element={<ClientPersonalPage />} />

          <Route element={<ProtectedRoute allowedRoles={['ARTIST']} />}>
            <Route path="/artista" element={<ArtistAgendaPage />} />
            <Route path="/artista/perfil" element={<ArtistProfilePage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['STAFF']} />}>
            <Route path="/staff" element={<StaffPersonalPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['FOODTRUCK']} />}>
            <Route path="/foodtruck" element={<FoodtruckPersonalPage />} />
          </Route>
          
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;