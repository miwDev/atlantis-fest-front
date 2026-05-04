import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useConcerts } from '../../hooks/useConcerts';
import { purchaseService } from '../../services/purchase.service';
import { useAuthStore } from '../../store/authStore';
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
  
  const { logout: authLogout, user: authUser } = useAuthStore();
  const clientName = authUser?.name || 'ASISTENTE';
  const clientId = authUser?.id;

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
    authLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-atlantis-white text-atlantis-bg-main font-plex relative overflow-hidden pt-32 pb-24">
      
      {/* Ambient Decor - Adjusted for better readability */}
      <div className="absolute top-1/4 -right-32 md:-right-60 w-[21rem] md:w-[33.6rem] h-auto opacity-[0.08] pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg2} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="absolute bottom-0 -left-32 md:-left-60 w-[21rem] md:w-[33.6rem] h-auto opacity-[0.08] pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg1} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="container mx-auto max-w-6xl px-8 relative z-10">
        {/* Header - Matches Checkout style */}
        <div className="mb-24 border-b border-atlantis-bg-main/10 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-atlantis-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">ÁREA PERSONAL DEL ASISTENTE</span>
          </div>
          <h1 className="font-syne font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-6">
            HOLA, {clientName}<span className="text-atlantis-primary">.</span>
          </h1>
          <p className="font-plex text-sm md:text-base uppercase tracking-widest text-atlantis-bg-main/40 max-w-2xl leading-relaxed">
            Bienvenido a tu panel de control. Aquí puedes gestionar tus accesos, consultar el mapa interactivo y sincronizar tus horarios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Left Column: Tickets & Map */}
          <div className="lg:col-span-4 space-y-24">
            {/* Tickets Section */}
            <section>
              <div className="flex items-center justify-between mb-10 border-b border-atlantis-bg-main pb-4">
                <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter flex items-center gap-4">
                  <Ticket size={20} className="text-atlantis-primary" />
                  MIS PASES
                </h2>
                <span className="font-plex font-bold text-[10px] uppercase tracking-widest opacity-30">{purchases.length} TOTAL</span>
              </div>

              {loadingTickets ? (
                <div className="py-12 text-center text-[10px] uppercase tracking-widest opacity-40 animate-pulse">
                  Verificando blockchain de accesos...
                </div>
              ) : purchases.length > 0 ? (
                <div className="space-y-6">
                  {purchases.map(p => (
                    <motion.div 
                      key={p.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group border-b border-atlantis-bg-main/10 pb-6 hover:border-atlantis-primary transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-atlantis-primary bg-atlantis-primary/5 px-2 py-0.5">ACTIVO</span>
                        <span className="text-[10px] font-bold opacity-30">#{p.id.toString().padStart(6, '0')}</span>
                      </div>
                      <h3 className="font-syne font-black text-2xl uppercase tracking-tighter mb-4 group-hover:text-atlantis-primary transition-colors">{p.ticketTipo}</h3>
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">ATLANTIS FEST 2026</p>
                        <p className="font-syne font-black text-lg">{p.precioFinal}€</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-12 px-8 border border-dashed border-atlantis-bg-main/20 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest mb-8 opacity-40">No se encontraron entradas</p>
                  <Link to="/tickets" className="inline-block bg-atlantis-bg-main text-atlantis-white px-8 py-4 font-syne font-black text-[10px] uppercase tracking-widest hover:bg-atlantis-primary transition-all">
                    IR A TAQUILLA
                  </Link>
                </div>
              )}
            </section>

            {/* Map Section */}
            <section>
              <div className="flex items-center mb-10 border-b border-atlantis-bg-main pb-4">
                <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter flex items-center gap-4">
                  <MapIcon size={20} className="text-atlantis-primary" />
                  EL RECINTO
                </h2>
              </div>
              <div className="aspect-[4/5] bg-atlantis-bg-alt/10 flex flex-col items-center justify-center p-12 text-center border border-atlantis-bg-main/5 relative overflow-hidden group">
                <div className="z-10">
                  <div className="w-12 h-12 border border-atlantis-bg-main/20 flex items-center justify-center mb-6 mx-auto group-hover:border-atlantis-primary transition-colors">
                    <span className="font-syne font-black text-sm opacity-20">#MAP</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">MAPA INTERACTIVO</p>
                  <p className="text-[9px] uppercase tracking-widest opacity-30 max-w-[180px] leading-relaxed mx-auto">
                    El módulo de geolocalización de foodtrucks y escenarios se activará 24h antes del festival.
                  </p>
                </div>
                {/* Visual texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div className="grid grid-cols-6 h-full w-full">
                    {Array.from({ length: 24 }).map((_, i) => <div key={i} className="border border-atlantis-bg-main/10" />)}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Lineup */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-10 border-b border-atlantis-bg-main pb-4">
              <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter flex items-center gap-4">
                <Calendar size={20} className="text-atlantis-primary" />
                PROGRAMACIÓN
              </h2>
              <div className="flex gap-4">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-20 underline decoration-atlantis-primary/30">DÍA 01</span>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-10">DÍA 02</span>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-10">DÍA 03</span>
              </div>
            </div>

            {loadingLineup ? (
              <div className="py-24 text-center text-[10px] uppercase tracking-widest opacity-40">
                Sincronizando relojes del festival...
              </div>
            ) : (
              <div className="space-y-20">
                {groupedConcerts.map(group => (
                  <div key={group.date}>
                    <div className="flex items-baseline gap-6 mb-10">
                      <span className="font-syne font-black text-4xl uppercase tracking-tighter text-atlantis-primary italic">
                        {new Date(group.date).toLocaleDateString('es-ES', { day: '2-digit' })}
                      </span>
                      <span className="font-syne font-black text-xl uppercase tracking-widest opacity-30">
                        {new Date(group.date).toLocaleDateString('es-ES', { month: 'long' })} / {new Date(group.date).toLocaleDateString('es-ES', { weekday: 'long' })}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-px bg-atlantis-bg-main/5 border border-atlantis-bg-main/5">
                      {group.concerts.map(c => (
                        <motion.div 
                          key={c.id} 
                          whileHover={{ x: 10 }}
                          className="bg-atlantis-white p-8 flex flex-col md:flex-row justify-between items-start md:items-center group transition-all"
                        >
                          <div className="flex flex-col md:flex-row md:items-center gap-8 mb-4 md:mb-0">
                            <div className="flex items-center gap-3">
                              <Clock size={12} className="text-atlantis-primary" />
                              <span className="font-plex font-bold text-xs uppercase tracking-[0.2em]">{c.horaInicio}</span>
                            </div>
                            <div>
                              <h3 className="font-syne font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none mb-1 group-hover:text-atlantis-primary transition-colors">
                                {c.artistName}
                              </h3>
                              <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">{c.zoneNombre}</p>
                            </div>
                          </div>
                          <div className="hidden md:block">
                            <div className="w-12 h-px bg-atlantis-bg-main/10 group-hover:w-24 group-hover:bg-atlantis-primary transition-all duration-500" />
                          </div>
                        </motion.div>
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
