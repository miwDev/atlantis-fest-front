import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useConcerts } from '../../hooks/useConcerts';
import { purchaseService } from '../../services/purchase.service';
import { Ticket, Map as MapIcon, Calendar, Clock, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { PurchaseOutputDTO } from '../../types/output.dto';
import ticketImg1 from '../../assets/ticket1.webp';
import ticketImg2 from '../../assets/ticket2.webp';
import loginBg from '../../assets/LoginBG.png';

export const ClientPersonalPage = () => {
  const navigate = useNavigate();
  const { groupedConcerts, loadData, loading: loadingLineup } = useConcerts();
  const [purchases, setPurchases] = useState<PurchaseOutputDTO[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  
  const clientName = localStorage.getItem('atlantis_client_name') || 'ASISTENTE';
  const clientId = localStorage.getItem('atlantis_client_id');

  useEffect(() => {
    loadData();
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    if (!clientId) {
      setLoadingTickets(false);
      return;
    }
    try {
      const res = await purchaseService.getByClientId(clientId);
      setPurchases(res.content);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-atlantis-white text-atlantis-bg-main font-plex relative overflow-hidden pt-16 pb-24">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02] pointer-events-none z-0">
        <img src={loginBg} alt="" className="w-full h-full object-cover grayscale" />
      </div>
      <div className="absolute top-1/4 -right-16 md:-right-40 w-[21rem] md:w-[33.6rem] h-auto opacity-10 pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg2} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="container mx-auto max-w-6xl px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b-2 border-atlantis-bg-main pb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-atlantis-bg-main text-atlantis-white p-2">
                <User size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">ÁREA PERSONAL</span>
            </div>
            <h1 className="font-syne font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-4">
              HOLA, {clientName}
            </h1>
            <p className="font-plex text-sm uppercase tracking-widest text-atlantis-bg-main/60">
              Gestiona tus entradas y consulta los horarios del festival.
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 font-plex font-bold uppercase tracking-widest text-atlantis-error hover:opacity-70 transition-opacity"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Section 1: Tickets */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Ticket size={24} />
              <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter">TUS ENTRADAS</h2>
            </div>

            {loadingTickets ? (
              <div className="border-2 border-dashed border-atlantis-bg-main/20 p-12 text-center text-xs uppercase tracking-widest opacity-40">
                Buscando pases...
              </div>
            ) : purchases.length > 0 ? (
              <div className="space-y-4">
                {purchases.map(p => (
                  <div key={p.id} className="bg-atlantis-white border-2 border-atlantis-bg-main p-6 shadow-[8px_8px_0px_0px_rgba(22,24,33,1)]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">VALIDADA ✓</p>
                    <p className="font-syne font-black text-xl uppercase tracking-tighter mb-4">{p.ticketTipo}</p>
                    <div className="flex justify-between items-end border-t border-atlantis-bg-main/10 pt-4">
                      <div className="text-[9px] uppercase tracking-widest leading-relaxed">
                        <p className="font-bold">LOCALIZADOR</p>
                        <p className="opacity-60">{p.id.toString().padStart(6, '0')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold uppercase tracking-widest">PRECIO</p>
                        <p className="font-syne font-black text-lg leading-none">{p.precioFinal}€</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-atlantis-bg-main p-8 text-center bg-white/50 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-widest mb-6 opacity-60">No tienes entradas activas</p>
                <Link to="/tickets" className="inline-block bg-atlantis-bg-main text-atlantis-white px-6 py-3 font-syne font-black text-xs uppercase tracking-widest hover:bg-atlantis-primary transition-colors">
                  COMPRAR TICKETS
                </Link>
              </div>
            )}

            {/* Section 2: Interactive Map Placeholder */}
            <div className="pt-12">
              <div className="flex items-center gap-3 mb-6">
                <MapIcon size={24} />
                <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter">MAPA DEL RECINTO</h2>
              </div>
              <div className="aspect-square bg-atlantis-white border-2 border-atlantis-bg-main flex flex-col items-center justify-center p-12 text-center group">
                <div className="w-16 h-16 border-2 border-dashed border-atlantis-bg-main/20 flex items-center justify-center mb-4 group-hover:border-atlantis-primary transition-colors">
                   <span className="font-syne font-black text-xl">#TODO</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Módulo Interactivo en desarrollo</p>
                <p className="text-[8px] uppercase tracking-widest opacity-20 mt-2 max-w-[150px]">Próximamente podrás ver la ubicación de los escenarios y foodtrucks en tiempo real.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Concert List */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <Calendar size={24} />
              <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter">LINEUP & HORARIOS</h2>
            </div>

            {loadingLineup ? (
              <div className="border-2 border-dashed border-atlantis-bg-main/20 p-24 text-center text-xs uppercase tracking-widest opacity-40">
                Sincronizando reloj...
              </div>
            ) : (
              <div className="space-y-12">
                {groupedConcerts.map(group => (
                  <div key={group.date}>
                    <div className="bg-atlantis-bg-main text-atlantis-white inline-block px-4 py-2 mb-6">
                      <p className="font-syne font-black text-lg uppercase tracking-tighter">
                        {new Date(group.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.concerts.map(c => (
                        <div key={c.id} className="border-2 border-atlantis-bg-main p-6 hover:bg-atlantis-primary/5 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 text-atlantis-primary">
                              <Clock size={14} />
                              <span className="font-plex font-bold text-xs uppercase tracking-widest">{c.horaInicio} - {c.horaFin}</span>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest opacity-40 bg-atlantis-bg-main/5 px-2 py-1">{c.zoneNombre}</span>
                          </div>
                          <h3 className="font-syne font-black text-xl uppercase tracking-tighter leading-none mb-1">{c.artistName}</h3>
                          <p className="text-[10px] uppercase tracking-widest opacity-60 font-medium">ESCENARIO PRINCIPAL</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
