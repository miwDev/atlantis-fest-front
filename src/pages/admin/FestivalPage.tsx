import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFestivals } from "../../hooks/useFestivals";
import { useArtists } from "../../hooks/useArtists";
import { useConcerts } from "../../hooks/useConcerts";
import { useZones } from "../../hooks/useZones";
import { ChevronLeft, ChevronRight, Users, Music, Map as MapIcon, Calendar as CalendarIcon, Ticket } from "lucide-react";

type TabType = 'lineup' | 'agenda' | 'config';

export const FestivalPage = () => {
  const { currentFestival: festival, sales, loading: festivalLoading, error, saveFestival, loadDashboard } = useFestivals();
  
  // Widget states
  const { artists, pagination: artistsPage, getArtists, loading: artistsLoading } = useArtists();
  const { rawConcerts, loadData: loadConcerts, loading: concertsLoading } = useConcerts();
  const { zones, pagination: zonesPage, getZones, loading: zonesLoading } = useZones();

  const [concertPageNum, setConcertPageNum] = useState(0);
  const concertsPerPage = 5;
  const totalConcertsPages = Math.ceil((rawConcerts?.length || 0) / concertsPerPage);
  const concerts = (rawConcerts || []).slice(concertPageNum * concertsPerPage, (concertPageNum + 1) * concertsPerPage);
  const concertsPage = {
    number: concertPageNum,
    totalPages: totalConcertsPages,
    first: concertPageNum === 0,
    last: concertPageNum >= totalConcertsPages - 1
  };

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    ubicacionGeneral: ""
  });

  const [activeTab, setActiveTab] = useState<TabType>('lineup');

  useEffect(() => {
    loadDashboard();
    getArtists(0);
    loadConcerts();
    getZones(0);
  }, []);

  useEffect(() => {
    if (festival) {
      setForm({
        nombre: festival.nombre,
        fechaInicio: festival.fechaInicio.split("T")[0],
        fechaFin: festival.fechaFin.split("T")[0],
        ubicacionGeneral: festival.ubicacionGeneral || ""
      });
    }
  }, [festival]);

  const handleSave = async () => {
    if (!festival) return;
    try {
      await saveFestival(form, festival.id);
      setIsEditing(false);
    } catch (e) {
      // Error handled by hook
    }
  };

  if (festivalLoading && !festival) {
    return <div className="p-8 text-atlantis-secondary font-plex text-xs uppercase tracking-widest flex items-center gap-4 animate-pulse"><div className="w-4 h-4 bg-atlantis-primary"></div>INICIALIZANDO COMANDO CENTRAL...</div>;
  }

  if (!festival) {
    return (
      <div className="container mx-auto max-w-7xl px-8 md:px-12 py-12">
        <h1 className="font-syne font-bold text-4xl text-atlantis-bg-main mb-4 uppercase tracking-tight">Centro de Mando</h1>
        <p className="font-plex text-sm text-atlantis-secondary">NO HAY NINGÚN FESTIVAL ACTIVO EN EL SISTEMA.</p>
      </div>
    );
  }

  // Cálculos para las cards
  const totalVendidos = sales.reduce((acc, curr) => acc + curr.vendidos, 0);
  const totalIngresos = sales.reduce((acc, curr) => acc + curr.ingresoTotal, 0);
  const totalZonas = zonesPage?.totalElements || 0;
  const fechaInicio = new Date(festival.fechaInicio);
  const diasRestantes = Math.max(0, Math.ceil((fechaInicio.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
  
  const getFestivalStatus = () => {
    const now = new Date();
    const start = new Date(festival.fechaInicio);
    const end = new Date(festival.fechaFin);
    if (now < start) return { label: "PRÓXIMO", color: "bg-atlantis-primary text-atlantis-bg-main" };
    if (now > end) return { label: "FINALIZADO", color: "bg-atlantis-secondary/20 text-atlantis-secondary" };
    return { label: "EN CURSO", color: "bg-atlantis-error text-atlantis-white animate-pulse" };
  };

  const status = getFestivalStatus();

  return (
    <div className="container mx-auto max-w-7xl px-8 md:px-12 py-12 space-y-8 pb-24 font-plex">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-atlantis-bg-main">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 bg-atlantis-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-atlantis-secondary">CENTRO DE MANDO</span>
           </div>
           <h1 className="font-syne font-black text-5xl md:text-6xl text-atlantis-bg-main uppercase tracking-tighter">{festival.nombre}</h1>
        </div>
        <div className={`px-6 py-2 text-[10px] font-black uppercase tracking-[0.3em] rounded-sm ${status.color}`}>
          {status.label}
        </div>
      </div>

      {error && (
        <div className="px-6 py-4 border border-atlantis-error/30 bg-atlantis-error/10 font-plex text-xs text-atlantis-error uppercase tracking-widest">
          ⚠️ {error}
        </div>
      )}

      {/* KPIs Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-8 border-b border-atlantis-bg-main/10">
        <KpiCard title="TICKETS VENDIDOS" value={totalVendidos.toString()} subtitle="Volumen total" />
        <KpiCard title="INGRESOS BRUTOS" value={`${totalIngresos.toLocaleString()}€`} subtitle="Facturación acumulada" />
        <KpiCard title="ZONAS DESPLEGADAS" value={totalZonas.toString()} subtitle="Infraestructura activa" />
        <KpiCard title="CUENTA ATRÁS" value={diasRestantes.toString()} subtitle="Días para inicio" />
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-8 pt-4">
        <TabButton active={activeTab === 'lineup'} onClick={() => setActiveTab('lineup')}>LINEUP</TabButton>
        <TabButton active={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')}>AGENDA</TabButton>
        <TabButton active={activeTab === 'config'} onClick={() => setActiveTab('config')}>CONFIGURACIÓN & SECTORES</TabButton>
      </div>

      {/* TAB CONTENT - Fixed minimum height to prevent layout shifts */}
      <div className="min-h-[380px] pt-6">
        
        {/* LINEUP TAB */}
        {activeTab === 'lineup' && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-syne font-black text-xl text-atlantis-bg-main uppercase tracking-tighter">ARTISTAS CONFIRMADOS</h2>
              <PaginationControls page={artistsPage} onPrev={() => getArtists((artistsPage?.number || 1) - 1)} onNext={() => getArtists((artistsPage?.number || 0) + 1)} loading={artistsLoading} />
            </div>
            
            {artistsLoading && !artists.length ? (
              <div className="py-20 text-center text-[9px] uppercase tracking-widest text-atlantis-secondary/50 animate-pulse">[ Cargando artistas ]</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                {artists.length === 0 ? (
                   <div className="col-span-5 text-center text-[9px] tracking-[0.2em] uppercase text-atlantis-secondary/40 py-20 border border-dashed border-atlantis-bg-main/10">No hay artistas registrados</div>
                ) : artists.map((a: any) => (
                  <div key={a.id} className="group relative flex flex-col items-start gap-3">
                    <div className="w-full aspect-square bg-atlantis-bg-main/5 overflow-hidden relative">
                      {a.fotoUrl ? (
                         <img src={a.fotoUrl} alt={a.artistName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-atlantis-bg-main/10 text-xs">IMG</div>
                      )}
                      <div className="absolute inset-0 bg-atlantis-primary mix-blend-multiply opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </div>
                    <div className="w-full">
                       {/* Se arregló la superposición usando line-clamp y leading-tight en lugar de leading-none */}
                       <span className="font-syne font-bold text-lg leading-tight uppercase text-atlantis-bg-main block line-clamp-2 w-full">{a.artistName}</span>
                       <span className="font-plex text-[8px] font-black uppercase tracking-[0.1em] text-atlantis-secondary mt-1 block">{a.genres?.[0] || 'ARTISTA'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8 flex justify-start">
               <Link to="/admin/artistas" className="text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-primary hover:text-atlantis-bg-main transition-colors">→ Gestionar Roaster Completo</Link>
            </div>
          </div>
        )}

        {/* AGENDA TAB */}
        {activeTab === 'agenda' && (
          <div className="flex flex-col h-full max-w-4xl">
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-syne font-black text-xl text-atlantis-bg-main uppercase tracking-tighter">TIMETABLE OFICIAL</h2>
              <PaginationControls page={concertsPage} onPrev={() => setConcertPageNum(Math.max(0, concertPageNum - 1))} onNext={() => setConcertPageNum(Math.min(totalConcertsPages - 1, concertPageNum + 1))} loading={concertsLoading} />
            </div>
            
            {concertsLoading && !concerts.length ? (
              <div className="py-20 text-center text-[9px] uppercase tracking-widest text-atlantis-secondary/50 animate-pulse">[ Sincronizando horarios ]</div>
            ) : (
              <div className="flex flex-col gap-4">
                {concerts.length === 0 ? (
                   <div className="text-center text-[9px] tracking-[0.2em] uppercase text-atlantis-secondary/40 py-20 border border-dashed border-atlantis-bg-main/10">Agenda vacía</div>
                ) : concerts.map((c: any) => (
                  <div key={c.id} className="flex flex-row items-center py-3 border-b border-atlantis-bg-main/5 group hover:bg-atlantis-bg-main/[0.02] px-2 -mx-2 transition-colors">
                    <span className="font-plex text-sm font-bold tracking-widest text-atlantis-secondary w-24">{c.horaInicio?.slice(0,5)}</span>
                    <div className="flex flex-col flex-1">
                      <span className="font-syne font-bold text-xl uppercase tracking-tight group-hover:text-atlantis-primary transition-colors truncate">{c.artistName}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-bg-main/40">{c.fecha}</span>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-bg-main/60">/ {c.zoneName || c.zoneNombre}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
             <div className="mt-8 flex justify-start">
               <Link to="/admin/conciertos" className="text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-primary hover:text-atlantis-bg-main transition-colors">→ Modificar Timetable</Link>
            </div>
          </div>
        )}

        {/* CONFIG TAB */}
        {activeTab === 'config' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 h-full">
            
            {/* Widget: Festival Config */}
            <div className="flex flex-col">
               <div className="flex justify-between items-end mb-6">
                 <h2 className="font-syne font-black text-xl text-atlantis-bg-main uppercase tracking-tighter">PARÁMETROS</h2>
                 <button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="font-plex text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-primary hover:text-atlantis-bg-main transition-colors"
                 >
                  [{isEditing ? "GUARDAR" : "EDITAR"}]
                 </button>
               </div>
               
               <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                 <div className="col-span-2">
                   <ConfigField label="DENOMINACIÓN" value={form.nombre} isEditing={isEditing} onChange={(v) => setForm({...form, nombre: v})} />
                 </div>
                 <ConfigField label="COORDENADAS" value={form.ubicacionGeneral} isEditing={isEditing} onChange={(v) => setForm({...form, ubicacionGeneral: v})} />
                 <ConfigField label="APERTURA" type="date" value={form.fechaInicio} isEditing={isEditing} onChange={(v) => setForm({...form, fechaInicio: v})} />
                 <ConfigField label="CLAUSURA" type="date" value={form.fechaFin} isEditing={isEditing} onChange={(v) => setForm({...form, fechaFin: v})} />
               </div>
               {isEditing && (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="w-full mt-6 font-plex text-[8px] font-black uppercase tracking-[0.2em] border border-atlantis-bg-main/10 text-atlantis-bg-main/40 py-2 hover:border-atlantis-error hover:text-atlantis-error transition-colors"
                >
                  DESCARTAR CAMBIOS
                </button>
              )}
            </div>

            {/* Widget: Zonas */}
            <div className="flex flex-col">
               <div className="flex justify-between items-end mb-6">
                <h2 className="font-syne font-black text-xl text-atlantis-bg-main uppercase tracking-tighter">SECTORES ACTIVOS</h2>
                <PaginationControls page={zonesPage} onPrev={() => getZones((zonesPage?.number || 1) - 1)} onNext={() => getZones((zonesPage?.number || 0) + 1)} loading={zonesLoading} />
              </div>

              {zonesLoading && !zones.length ? (
                <div className="py-8 text-center text-[9px] uppercase tracking-widest text-atlantis-secondary/50 animate-pulse">[ Escaneando sectores ]</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {zones.length === 0 ? (
                     <div className="col-span-2 text-center text-[9px] tracking-[0.2em] uppercase text-atlantis-secondary/40 py-8 border border-dashed border-atlantis-bg-main/10">Sin sectores</div>
                  ) : zones.map((z: any) => (
                    <div key={z.id} className="p-3 border border-atlantis-bg-main/10 hover:border-atlantis-primary transition-colors flex flex-col justify-center items-start group">
                       <span className="font-syne font-bold text-sm uppercase tracking-tight text-atlantis-bg-main group-hover:text-atlantis-primary transition-colors line-clamp-1">{z.nombre}</span>
                       <span className="font-plex text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-secondary mt-1">{z.tipo}</span>
                    </div>
                  ))}
                </div>
              )}
               <div className="mt-8 flex justify-start">
                 <Link to="/admin/zonas" className="text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-primary hover:text-atlantis-bg-main transition-colors">→ Ver Mapa y Administrar</Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULL WIDTH BOTTOM: Rendimiento */}
      <div className="pt-12 mt-4 border-t border-atlantis-bg-main/10">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-6 pb-2 border-b border-atlantis-bg-main">
          <div>
             <h2 className="font-syne font-black text-2xl text-atlantis-bg-main uppercase tracking-tighter">MÉTRICAS DE TICKETS</h2>
          </div>
          <Link to="/admin/tickets" className="mt-4 sm:mt-0 font-plex text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-bg-main/40 hover:text-atlantis-primary transition-colors">
            Gestionar Pricing →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-atlantis-bg-main/5">
                <th className="py-2 pr-4 font-plex text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-secondary/50">PASE</th>
                <th className="py-2 px-4 font-plex text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-secondary/50">PRECIO</th>
                <th className="py-2 px-4 font-plex text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-secondary/50">VENTAS</th>
                <th className="py-2 px-4 font-plex text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-secondary/50">STOCK</th>
                <th className="py-2 pl-4 font-plex text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-secondary/50 text-right">INGRESOS</th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center font-plex text-[9px] font-black text-atlantis-secondary/40 uppercase tracking-[0.2em] border border-dashed border-atlantis-bg-main/10">
                    SISTEMA DE TICKETING INACTIVO
                  </td>
                </tr>
              ) : (
                sales.map(sale => {
                  const total = sale.disponibles + sale.vendidos;
                  const porcentaje = total > 0 ? (sale.vendidos / total) * 100 : 0;
                  
                  return (
                    <tr key={sale.ticketTypeId} className="border-b border-atlantis-bg-main/5 hover:bg-atlantis-bg-main/[0.02] transition-colors group">
                      <td className="py-4 pr-4 font-syne font-black text-xl tracking-tight text-atlantis-bg-main uppercase group-hover:text-atlantis-primary transition-colors">{sale.tipo}</td>
                      <td className="py-4 px-4 font-plex text-sm text-atlantis-bg-main font-bold">{sale.precioBase}€</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="font-plex text-sm font-bold text-atlantis-bg-main min-w-[24px]">{sale.vendidos}</span>
                          <div className="w-full max-w-[120px] h-1 bg-atlantis-bg-main/5 overflow-hidden">
                            <div className={`h-full ${porcentaje >= 100 ? 'bg-atlantis-error' : 'bg-atlantis-primary'}`} style={{ width: `${Math.min(porcentaje, 100)}%` }}></div>
                          </div>
                          <span className="font-plex text-[8px] font-black uppercase tracking-[0.1em] text-atlantis-secondary min-w-[30px]">{Math.round(porcentaje)}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-plex text-sm text-atlantis-bg-main font-bold">{sale.disponibles}</td>
                      <td className="py-4 pl-4 font-syne font-black text-xl tracking-tight text-atlantis-bg-main text-right">{sale.ingresoTotal.toLocaleString()}€</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

// COMPONENTES AUXILIARES MINIMALISTAS

const TabButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`font-plex text-[10px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 transition-colors ${active ? 'border-atlantis-primary text-atlantis-bg-main' : 'border-transparent text-atlantis-secondary/40 hover:text-atlantis-primary/60'}`}
  >
    {children}
  </button>
);

const KpiCard = ({ title, value, subtitle }: { title: string, value: string, subtitle: string }) => (
  <div className="flex flex-col">
    <h3 className="font-plex text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-secondary/60 mb-1">{title}</h3>
    <p className="font-syne font-black text-3xl md:text-4xl text-atlantis-bg-main mb-1 tracking-tighter leading-none">{value}</p>
    <p className="font-plex text-[8px] font-bold text-atlantis-secondary uppercase tracking-[0.1em]">{subtitle}</p>
  </div>
);

const ConfigField = ({ label, value, isEditing, type = "text", onChange }: { label: string, value: string, isEditing: boolean, type?: string, onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-1">
    <label className="font-plex text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-secondary/60">
      {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-atlantis-bg-main py-1 font-syne text-lg font-bold text-atlantis-bg-main focus:outline-none focus:border-atlantis-primary transition-colors bg-transparent [color-scheme:light]"
      />
    ) : (
      <p className="font-syne text-xl font-bold tracking-tight text-atlantis-bg-main truncate">{value || "—"}</p>
    )}
  </div>
);

const PaginationControls = ({ page, onPrev, onNext, loading }: { page: any, onPrev: () => void, onNext: () => void, loading: boolean }) => {
  if (!page || page.totalPages <= 1) return null;
  const isFirst = page.first;
  const isLast = page.last;

  return (
    <div className="flex items-center gap-3">
      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-atlantis-bg-main/40">
        {page.number + 1} / {page.totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button 
          onClick={onPrev} 
          disabled={isFirst || loading} 
          className="p-1 text-atlantis-bg-main/40 hover:text-atlantis-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        <button 
          onClick={onNext} 
          disabled={isLast || loading} 
          className="p-1 text-atlantis-bg-main/40 hover:text-atlantis-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
