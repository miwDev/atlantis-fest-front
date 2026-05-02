import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFestivals } from "../../hooks/useFestivals";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";

export const FestivalPage = () => {
  const { currentFestival: festival, zones, sales, loading, error, saveFestival, loadDashboard: refreshDashboard } = useFestivals();
  
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    ubicacionGeneral: ""
  });

  useEffect(() => {
    refreshDashboard();
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

  if (loading && !festival) {
    return <div className="p-8 text-atlantis-secondary font-plex text-xs uppercase tracking-widest">Cargando dashboard...</div>;
  }

  if (!festival) {
    return (
      <div className="container mx-auto max-w-6xl px-8 md:px-16 py-12">
        <h1 className="font-syne font-bold text-4xl text-atlantis-bg-main mb-4 uppercase tracking-tight">Festival</h1>
        <p className="font-plex text-sm text-atlantis-secondary">No hay ningún festival creado en el sistema.</p>
      </div>
    );
  }

  // Cálculos para las cards
  const totalVendidos = sales.reduce((acc, curr) => acc + curr.vendidos, 0);
  const totalIngresos = sales.reduce((acc, curr) => acc + curr.ingresoTotal, 0);
  const fechaInicio = new Date(festival.fechaInicio);
  const diasRestantes = Math.max(0, Math.ceil((fechaInicio.getTime() - new Date().getTime()) / (1000 * 3600 * 24)));
  
  const getFestivalStatus = () => {
    const now = new Date();
    const start = new Date(festival.fechaInicio);
    const end = new Date(festival.fechaFin);
    if (now < start) return { label: "PRÓXIMO", color: "bg-atlantis-primary text-atlantis-bg-main" };
    if (now > end) return { label: "FINALIZADO", color: "bg-atlantis-secondary/20 text-atlantis-secondary" };
    return { label: "EN CURSO", color: "bg-atlantis-error text-atlantis-white" };
  };

  const status = getFestivalStatus();

  return (
    <div className="container mx-auto max-w-6xl px-8 md:px-16 py-12 space-y-12">
      <div className="flex justify-between items-start">
        <AdminPageHeader
          title={festival.nombre}
          subtitle={`Dashboard y métricas de rendimiento`}
        />
        <div className={`px-4 py-1 mt-2 font-plex text-[10px] font-black uppercase tracking-[0.2em] rounded-full ${status.color}`}>
          {status.label}
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 border border-atlantis-error/30 bg-atlantis-error/10 font-plex text-xs text-atlantis-error uppercase tracking-widest">
          {error}
        </div>
      )}

      {/* Cards de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Tickets Vendidos" value={totalVendidos.toString()} subtitle="Total general" />
        <StatCard title="Ingresos Estimados" value={`${totalIngresos.toLocaleString()}€`} subtitle="Bruto acumulado" />
        <StatCard title="Zonas Activas" value={zones.length.toString()} subtitle="Zonas configuradas" />
        <StatCard title="Cuenta Atrás" value={diasRestantes.toString()} subtitle="Días para inicio" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Columna Izquierda: Detalles del Festival */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex justify-between items-center border-b border-atlantis-secondary/20 pb-4">
            <h2 className="font-syne font-bold text-xl text-atlantis-bg-main uppercase tracking-tight">Detalles</h2>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="font-plex text-[10px] font-black uppercase tracking-widest text-atlantis-primary hover:text-atlantis-bg-main transition-colors"
            >
              {isEditing ? "Guardar" : "Editar"}
            </button>
          </div>
          
          <div className="space-y-4">
            <DetailField label="Nombre" value={form.nombre} isEditing={isEditing} onChange={(v) => setForm({...form, nombre: v})} />
            <DetailField label="Ubicación" value={form.ubicacionGeneral} isEditing={isEditing} onChange={(v) => setForm({...form, ubicacionGeneral: v})} />
            <DetailField label="Fecha Inicio" type="date" value={form.fechaInicio} isEditing={isEditing} onChange={(v) => setForm({...form, fechaInicio: v})} />
            <DetailField label="Fecha Fin" type="date" value={form.fechaFin} isEditing={isEditing} onChange={(v) => setForm({...form, fechaFin: v})} />
          </div>

          {isEditing && (
            <button 
              onClick={() => setIsEditing(false)}
              className="w-full font-plex text-[10px] font-black uppercase tracking-widest border border-atlantis-secondary/30 text-atlantis-secondary py-2 mt-2 hover:border-atlantis-bg-main hover:text-atlantis-bg-main transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>

        {/* Columna Derecha: Zonas y Ventas */}
        <div className="lg:col-span-2 space-y-12">
          {/* Zonas */}
          <section>
            <div className="flex justify-between items-center border-b border-atlantis-secondary/20 pb-4 mb-6">
              <h2 className="font-syne font-bold text-xl text-atlantis-bg-main uppercase tracking-tight">Zonas del Festival</h2>
              <Link to="/admin/zonas" className="font-plex text-[10px] font-black uppercase tracking-widest text-atlantis-primary hover:text-atlantis-bg-main transition-colors">
                Gestionar Zonas →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zones.length === 0 ? (
                <p className="font-plex text-xs text-atlantis-secondary uppercase tracking-widest col-span-2">No hay zonas configuradas.</p>
              ) : (
                zones.map(zone => (
                  <div key={zone.id} className="border border-atlantis-secondary/20 p-4 hover:border-atlantis-primary transition-colors">
                    <h3 className="font-syne font-bold text-lg text-atlantis-bg-main uppercase mb-1">{zone.nombre}</h3>
                    <p className="font-plex text-[10px] text-atlantis-secondary uppercase tracking-widest mb-2">{zone.tipo}</p>
                    {zone.descripcion && (
                      <p className="font-plex text-xs text-atlantis-secondary line-clamp-2">{zone.descripcion}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Ventas de Tickets */}
          <section>
            <div className="flex justify-between items-center border-b border-atlantis-secondary/20 pb-4 mb-6">
              <h2 className="font-syne font-bold text-xl text-atlantis-bg-main uppercase tracking-tight">Rendimiento por Ticket</h2>
              <Link to="/admin/tickets" className="font-plex text-[10px] font-black uppercase tracking-widest text-atlantis-primary hover:text-atlantis-bg-main transition-colors">
                Ver Todos →
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-atlantis-secondary/20">
                    <th className="py-3 px-4 font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary">Tipo</th>
                    <th className="py-3 px-4 font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary">Precio Base</th>
                    <th className="py-3 px-4 font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary">Vendidos</th>
                    <th className="py-3 px-4 font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary">Disponibles</th>
                    <th className="py-3 px-4 font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary text-right">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 px-4 text-center font-plex text-xs text-atlantis-secondary uppercase tracking-widest">
                        No hay tickets configurados.
                      </td>
                    </tr>
                  ) : (
                    sales.map(sale => {
                      const porcentaje = sale.disponibles + sale.vendidos > 0 
                        ? (sale.vendidos / (sale.vendidos + sale.disponibles)) * 100 
                        : 0;
                      
                      return (
                        <tr key={sale.ticketTypeId} className="border-b border-atlantis-secondary/10 hover:bg-atlantis-secondary/5 transition-colors">
                          <td className="py-4 px-4 font-syne font-bold text-atlantis-bg-main uppercase">{sale.tipo}</td>
                          <td className="py-4 px-4 font-plex text-xs text-atlantis-secondary">{sale.precioBase}€</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-plex text-xs font-bold text-atlantis-bg-main">{sale.vendidos}</span>
                              <div className="w-16 h-1.5 bg-atlantis-secondary/20 rounded-full overflow-hidden">
                                <div className="h-full bg-atlantis-primary" style={{ width: `${porcentaje}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-plex text-xs text-atlantis-secondary">{sale.disponibles}</td>
                          <td className="py-4 px-4 font-plex text-xs font-bold text-atlantis-primary text-right">{sale.ingresoTotal.toLocaleString()}€</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle }: { title: string, value: string, subtitle: string }) => (
  <div className="border border-atlantis-secondary/20 p-6 bg-atlantis-white flex flex-col justify-center">
    <h3 className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary mb-2">{title}</h3>
    <p className="font-syne font-bold text-3xl text-atlantis-bg-main mb-1 tracking-tight">{value}</p>
    <p className="font-plex text-[10px] text-atlantis-secondary uppercase tracking-widest">{subtitle}</p>
  </div>
);

const DetailField = ({ 
  label, value, isEditing, type = "text", onChange 
}: { 
  label: string, value: string, isEditing: boolean, type?: string, onChange: (v: string) => void 
}) => (
  <div>
    <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block mb-1">
      {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-atlantis-primary/50 px-3 py-2 font-plex text-xs text-atlantis-bg-main focus:outline-none focus:border-atlantis-primary transition-colors bg-atlantis-primary/5"
      />
    ) : (
      <p className="font-plex text-sm text-atlantis-bg-main py-1">{value || "—"}</p>
    )}
  </div>
);
