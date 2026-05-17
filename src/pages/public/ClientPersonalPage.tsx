import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConcerts } from '../../hooks/useConcerts';
import { useFoodtrucks } from '../../hooks/useFoodtrucks';
import { purchaseService } from '../../services/purchase.service';
import { foodtruckService } from '../../services/foodtruck.service';
import { useAuthStore } from '../../store/authStore';
import { Ticket, Map as MapIcon, Calendar, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { PurchaseOutputDTO, ConcertOutputDTO, FoodtruckOutputDTO } from '../../types/output.dto';
import ticketImg1 from '../../assets/ticket1.webp';
import ticketImg2 from '../../assets/ticket2.webp';
import mapaImg from '../../assets/Mapa.png';

interface ZoneDef {
  id: string;
  name: string;
  type: 'ESCENARIO' | 'VIP' | 'BAÑOS' | 'ENTRADA' | 'GENERAL' | 'FOODTRUCK';
  coords: string;
}

const mapZones: ZoneDef[] = [
  { id: 'escenario-poseidon', name: "Escenario Poseidón", type: 'ESCENARIO', coords: "569,647,553,1596,1007,1596,1002,647" },
  { id: 'vip-triton', name: "Zona VIP Tritón", type: 'VIP', coords: "193,902,198,1351,407,1361,386,897" },
  { id: 'banos-oeste', name: "Baños Sector Oeste", type: 'BAÑOS', coords: "1216,177,1205,381,2395,360,2374,177" },
  { id: 'entrada-principal', name: "Entrada Principal", type: 'ENTRADA', coords: "2969,1867,3083,1857,3078,2315,3433,2347,3428,2540,2619,2545,2598,2347,2979,2326" },
  { id: 'escenario-anfitrite', name: "Escenario Anfitrite", type: 'ESCENARIO', coords: "5301,448,5306,1486,5682,1481,5666,469" },
  { id: 'vip-sirena', name: "Zona VIP Sirena", type: 'VIP', coords: "5296,1596,5290,1768,5697,1768,5676,1591" },
  { id: 'banos-este', name: "Baños Sector Este", type: 'BAÑOS', coords: "4101,1862,4101,2055,4852,2065,4852,1857" },
  { id: 'area-descanso', name: "Área de Descanso", type: 'GENERAL', coords: "1195,548,1200,1679,2483,1684,2483,1544,2963,1549,2969,1778,3120,1773,3099,1580,5196,1611,5139,448,3678,454,3673,730,2504,751,2499,527" },
  { id: 'foodtruck-nereo-1', name: "Foodtruck 1", type: 'FOODTRUCK', coords: "1195,1830,1205,2008,1748,1997,1737,1836" },
  { id: 'foodtruck-nereo-2', name: "Foodtruck 2", type: 'FOODTRUCK', coords: "1894,1846,1904,1987,2452,1997,2457,1836" },
  { id: 'foodtruck-proteo-1', name: "Foodtruck 3", type: 'FOODTRUCK', coords: "2541,1617,2551,1768,2849,1778,2838,1627" },
  { id: 'foodtruck-proteo-2', name: "Foodtruck 4", type: 'FOODTRUCK', coords: "3209,1638,3209,1763,3590,1757,3584,1627" },
  { id: 'foodtruck-glauco-1', name: "Foodtruck 5", type: 'FOODTRUCK', coords: "2556,501,2546,657,2932,647,2932,501" },
  { id: 'foodtruck-glauco-2', name: "Foodtruck 6", type: 'FOODTRUCK', coords: "3115,516,3094,652,3475,657,3475,511" },
  { id: 'foodtruck-oceano-1', name: "Foodtruck 7", type: 'FOODTRUCK', coords: "3600,141,3590,302,4315,302,4304,151" },
  { id: 'foodtruck-oceano-2', name: "Foodtruck 8", type: 'FOODTRUCK', coords: "4476,151,4476,313,5181,292,5176,136" }
];

export const ClientPersonalPage = () => {
  const navigate = useNavigate();
  const { rawConcerts, groupedConcerts, loadData, loading: loadingLineup } = useConcerts();
  const { foodtrucks, getFoodtrucks } = useFoodtrucks();
  const [purchases, setPurchases] = useState<PurchaseOutputDTO[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  const [hoveredZone, setHoveredZone] = useState<ZoneDef | null>(null);
  const [selectedStage, setSelectedStage] = useState<ZoneDef | null>(null);
  const [selectedFoodtruck, setSelectedFoodtruck] = useState<FoodtruckOutputDTO | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const { user: authUser } = useAuthStore();
  const clientName = authUser?.name || 'ASISTENTE';
  const clientId = authUser?.id;

  useEffect(() => {
    loadData();
    fetchTickets();
    getFoodtrucks();
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

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const getFoodtruckForZone = (zoneId: string) => {
    return foodtrucks.find(ft => ft.zoneNombre === zoneId);
  };

  const handleZoneClick = (zone: ZoneDef) => {
    if (zone.type === 'ESCENARIO') {
      setSelectedStage(zone);
    } else if (zone.type === 'FOODTRUCK') {
      const ft = getFoodtruckForZone(zone.id);
      if (ft) {
        setSelectedFoodtruck(ft);
      }
    }
  };

  const getConcertsForStage = (zoneId: string): ConcertOutputDTO[] => {
    return rawConcerts
      .filter((c) => c.zoneName === zoneId)
      .sort((a, b) => {
        if (a.fecha === b.fecha) {
          return a.horaInicio.localeCompare(b.horaInicio);
        }
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      });
  };

  return (
    <div className="min-h-screen bg-atlantis-white text-atlantis-bg-main font-plex relative overflow-hidden pt-32 pb-24">
      <div className="absolute top-1/4 -right-32 md:-right-60 w-[21rem] md:w-[33.6rem] h-auto opacity-[0.08] pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg2} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="absolute bottom-0 -left-32 md:-left-60 w-[21rem] md:w-[33.6rem] h-auto opacity-[0.08] pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg1} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="container mx-auto max-w-6xl px-8 relative z-10">
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
          <div className="lg:col-span-4 space-y-24">
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

                      <div className="flex gap-4 items-center mt-6 pt-6 border-t border-dashed border-atlantis-bg-main/10">
                        <div className="shrink-0 bg-atlantis-white p-1.5 border-2 border-atlantis-bg-main w-20 h-20 flex items-center justify-center">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ATLANTIS-${p.id}&color=161821&bgcolor=E6E9F0`} 
                            alt="QR de Acceso" 
                            className="w-full h-full object-contain" 
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-primary mb-1">ACCESO DIGITAL MOCK</p>
                          <p className="text-[10px] font-medium leading-relaxed opacity-60">Presenta este código QR dinámico en las puertas de control para validar tu pase.</p>
                        </div>
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

            <section>
              <div className="flex items-center mb-10 border-b border-atlantis-bg-main pb-4">
                <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter flex items-center gap-4">
                  <MapIcon size={20} className="text-atlantis-primary" />
                  EL RECINTO
                </h2>
              </div>
              <div 
                className="relative w-full overflow-hidden border border-atlantis-bg-main/20 shadow-2xl bg-atlantis-bg-alt/5 cursor-crosshair"
                onMouseMove={handleMouseMove}
              >
                <img 
                  src={mapaImg} 
                  alt="Recinto Atlantis" 
                  className="w-full h-auto object-cover opacity-90"
                  style={{ display: 'block' }}
                />
                
                <svg
                  viewBox="0 0 5906 2717"
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                >
                  {mapZones.map((zone) => {
                    const isFoodtruck = zone.type === 'FOODTRUCK';
                    const activeFoodtruck = isFoodtruck ? getFoodtruckForZone(zone.id) : null;
                    const isClosed = isFoodtruck && activeFoodtruck && !activeFoodtruck.estaAbierto;
                    const isActive = !isFoodtruck || !!activeFoodtruck;

                    return (
                      <polygon
                        key={zone.id}
                        points={zone.coords.replace(/,/g, ' ')}
                        className={`
                          transition-all duration-300
                          ${isActive ? 'cursor-pointer' : 'cursor-default'}
                          ${hoveredZone?.id === zone.id && isActive
                            ? (isClosed ? 'fill-atlantis-error/40 stroke-atlantis-error stroke-[10px]' : 'fill-atlantis-primary/40 stroke-atlantis-primary stroke-[10px]')
                            : 'fill-transparent stroke-transparent ' + (isClosed ? 'hover:fill-atlantis-error/20' : 'hover:fill-atlantis-primary/20')}
                        `}
                        onMouseEnter={() => isActive && setHoveredZone(zone)}
                        onMouseLeave={() => isActive && setHoveredZone(null)}
                        onClick={() => isActive && handleZoneClick(zone)}
                      />
                    );
                  })}
                </svg>

                <AnimatePresence>
                  {hoveredZone && !selectedStage && !selectedFoodtruck && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="fixed z-[100] pointer-events-none bg-atlantis-bg-main text-atlantis-white px-4 py-2 text-xs uppercase font-plex font-bold tracking-widest border border-atlantis-primary/50 shadow-xl"
                      style={{
                        left: mousePos.x + 15,
                        top: mousePos.y + 15,
                      }}
                    >
                      <div className="text-atlantis-primary mb-1 text-[8px] opacity-70">
                        {hoveredZone.type}
                      </div>
                      {hoveredZone.type === 'FOODTRUCK'
                        ? (() => {
                          const ft = getFoodtruckForZone(hoveredZone.id);
                          if (!ft) return hoveredZone.name;
                          return ft.estaAbierto ? ft.nombre : `${ft.nombre} (CERRADO)`;
                        })()
                        : hoveredZone.name}
                      {hoveredZone.type === 'ESCENARIO' && (
                        <div className="text-[9px] mt-2 font-normal text-atlantis-white/60 lowercase italic">
                          Click para ver horarios
                        </div>
                      )}
                      {hoveredZone.type === 'FOODTRUCK' && getFoodtruckForZone(hoveredZone.id) && (
                        <div className="text-[9px] mt-2 font-normal text-atlantis-white/60 lowercase italic">
                          Click para ver detalles
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>

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
                          <div className="flex flex-col md:flex-row md:items-center gap-8 mb-4 md:mb-0 flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-3 shrink-0">
                              <Clock size={12} className="text-atlantis-primary" />
                              <span className="font-plex font-bold text-xs uppercase tracking-[0.2em]">{c.horaInicio}</span>
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-syne font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none mb-1 group-hover:text-atlantis-primary transition-colors truncate">
                                {c.artistName}
                              </h3>
                              <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">{c.zoneName}</p>
                            </div>
                          </div>
                          <div className="hidden md:block shrink-0">
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

      <AnimatePresence>
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStage(null)}
            className="fixed inset-0 z-[200] flex justify-center items-center p-4 md:p-0 bg-atlantis-white/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-atlantis-bg-main w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-atlantis-bg-alt shadow-2xl p-8 md:p-12 cursor-default flex flex-col"
            >
              <div className="flex justify-between items-start mb-8 border-b border-atlantis-bg-alt/30 pb-6">
                <div>
                  <span className="font-plex text-atlantis-primary text-xs uppercase tracking-[0.3em] font-bold block mb-2">
                    LINEUP & SCHEDULE
                  </span>
                  <h3 className="font-syne font-black text-2xl md:text-3xl text-atlantis-white uppercase tracking-wider">
                    {selectedStage.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedStage(null)}
                  className="text-atlantis-white/50 hover:text-atlantis-primary transition-colors p-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="flex-grow flex flex-col gap-4">
                {getConcertsForStage(selectedStage.id).length === 0 ? (
                  <div className="text-center py-12 text-atlantis-white/50 font-plex text-sm uppercase tracking-widest">
                    No hay actuaciones programadas aún.
                  </div>
                ) : (
                  getConcertsForStage(selectedStage.id).map((concert) => (
                    <div
                      key={concert.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-atlantis-bg-alt/20 hover:border-atlantis-primary/40 bg-atlantis-white/5 transition-colors group"
                    >
                      <div className="mb-2 md:mb-0">
                        <span className="text-atlantis-white font-syne font-bold text-lg uppercase tracking-wider group-hover:text-atlantis-primary transition-colors">
                          {concert.artistName}
                        </span>
                        <div className="text-atlantis-white/60 font-plex text-[10px] uppercase tracking-widest mt-1">
                          {new Date(concert.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>
                      </div>
                      <div className="flex flex-row items-center gap-4 border-t md:border-t-0 md:border-l border-atlantis-bg-alt/20 pt-2 md:pt-0 md:pl-4 mt-2 md:mt-0">
                        <div className="flex flex-col items-center">
                          <span className="text-atlantis-white/40 text-[8px] font-plex uppercase tracking-widest mb-1">INICIO</span>
                          <span className="text-atlantis-white font-plex text-sm font-bold">{concert.horaInicio.slice(0, 5)}</span>
                        </div>
                        <div className="w-8 h-px bg-atlantis-bg-alt/40"></div>
                        <div className="flex flex-col items-center">
                          <span className="text-atlantis-white/40 text-[8px] font-plex uppercase tracking-widest mb-1">FIN</span>
                          <span className="text-atlantis-white font-plex text-sm font-bold">{concert.horaFin.slice(0, 5)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFoodtruck && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFoodtruck(null)}
            className="fixed inset-0 z-[200] flex justify-center items-center p-4 md:p-0 bg-atlantis-white/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-atlantis-white w-full max-w-md border border-atlantis-bg-main shadow-2xl p-8 cursor-default flex flex-col items-center text-center relative"
            >
              <button
                onClick={() => setSelectedFoodtruck(null)}
                className="absolute top-4 right-4 text-atlantis-bg-main/50 hover:text-atlantis-bg-main transition-colors p-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <span className="font-plex text-atlantis-primary text-[10px] uppercase tracking-[0.3em] font-bold block mb-4 border border-atlantis-primary px-3 py-1 rounded-full">
                {selectedFoodtruck.zoneNombre}
              </span>

              <h3 className="font-syne font-black text-3xl text-atlantis-bg-main uppercase tracking-widest mb-2">
                {selectedFoodtruck.nombre}
              </h3>

              {!selectedFoodtruck.estaAbierto && (
                <div className="bg-atlantis-error text-atlantis-white font-plex text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 mb-4 inline-block">
                  CERRADO ACTUALMENTE
                </div>
              )}

              <div className="text-atlantis-secondary font-plex text-sm uppercase tracking-widest mb-8">
                {selectedFoodtruck.tipoComida}
              </div>

              {selectedFoodtruck.tieneMenuPdf ? (
                <a
                  href={foodtruckService.getMenuPdfUrl(selectedFoodtruck.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-atlantis-bg-main text-atlantis-white hover:bg-atlantis-primary transition-colors px-8 py-3 font-plex text-sm font-bold tracking-widest flex items-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                  VER MENÚ COMPLETO (PDF)
                </a>
              ) : (
                <div className="text-atlantis-bg-main/50 font-plex text-xs uppercase tracking-widest italic border border-dashed border-atlantis-bg-main/20 w-full py-4">
                  Menú no disponible
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
