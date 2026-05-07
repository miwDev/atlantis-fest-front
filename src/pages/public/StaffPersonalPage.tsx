import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { shiftService } from '../../services/shift.service';
import { useAuthStore } from '../../store/authStore';
import { Calendar, Clock, User, Map as MapIcon, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { ShiftOutputDTO } from '../../types/output.dto';
import ticketImg1 from '../../assets/ticket1.webp';
import ticketImg2 from '../../assets/ticket2.webp';

export const StaffPersonalPage = () => {
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<ShiftOutputDTO[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(true);
  
  const { user: authUser } = useAuthStore();
  const staffUsername = authUser?.name || 'STAFF';

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    if (!authUser?.name) {
      setLoadingShifts(false);
      return;
    }
    try {
      // In a real app we might have a specific endpoint, but here we filter from all
      const res = await shiftService.getAll(0, 100);
      const myShifts = res.content.filter((s: ShiftOutputDTO) => s.staffUsername === authUser.name);
      setShifts(myShifts);
    } catch (err) {
      console.error("Error fetching shifts:", err);
    } finally {
      setLoadingShifts(false);
    }
  };

  return (
    <div className="min-h-screen bg-atlantis-white text-atlantis-bg-main font-plex relative overflow-hidden pt-32 pb-24">
      
      {/* Ambient Decor */}
      <div className="absolute top-1/4 -right-32 md:-right-60 w-[21rem] md:w-[33.6rem] h-auto opacity-[0.08] pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg2} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="absolute bottom-0 -left-32 md:-left-60 w-[21rem] md:w-[33.6rem] h-auto opacity-[0.08] pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg1} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="container mx-auto max-w-6xl px-8 relative z-10">
        {/* Header */}
        <div className="mb-24 border-b border-atlantis-bg-main/10 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-atlantis-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">ÁREA PERSONAL DEL STAFF</span>
          </div>
          <h1 className="font-syne font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-6">
            HOLA, {staffUsername}<span className="text-atlantis-primary">.</span>
          </h1>
          <p className="font-plex text-sm md:text-base uppercase tracking-widest text-atlantis-bg-main/40 max-w-2xl leading-relaxed">
            Bienvenido a tu panel de control. Aquí puedes gestionar tus turnos asignados y consultar la información operativa del festival.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Left Column: Personal Info & Logout */}
          <div className="lg:col-span-4 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-10 border-b border-atlantis-bg-main pb-4">
                <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter flex items-center gap-4">
                  <User size={20} className="text-atlantis-primary" />
                  MIS DATOS
                </h2>
              </div>
              
              <div className="space-y-6">
                <div className="border border-atlantis-bg-main/10 p-6 relative overflow-hidden bg-white/50 backdrop-blur-sm">
                  <div className="relative z-10 space-y-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1 font-bold">Usuario</p>
                      <p className="font-syne font-bold text-lg">{authUser?.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1 font-bold">Email</p>
                      <p className="font-plex font-bold text-sm truncate">{(authUser as any)?.email || 'staff@atlantisfest.com'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1 font-bold">Rol</p>
                      <p className="font-plex font-bold text-sm text-atlantis-primary">Operativo Staff</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Shifts */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-10 border-b border-atlantis-bg-main pb-4">
              <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter flex items-center gap-4">
                <Briefcase size={20} className="text-atlantis-primary" />
                MIS TURNOS
              </h2>
              <span className="font-plex font-bold text-[10px] uppercase tracking-widest opacity-30">{shifts.length} ASIGNADOS</span>
            </div>

            {loadingShifts ? (
              <div className="py-12 text-center text-[10px] uppercase tracking-widest opacity-40 animate-pulse">
                Sincronizando operaciones...
              </div>
            ) : shifts.length > 0 ? (
              <div className="space-y-6">
                {shifts.map((shift, idx) => (
                  <motion.div 
                    key={shift.id} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group border border-atlantis-bg-main/10 p-6 md:p-8 hover:border-atlantis-primary transition-all bg-white/50 backdrop-blur-sm relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-atlantis-bg-main/10 group-hover:bg-atlantis-primary transition-colors" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-4">
                      <div className="space-y-4 flex-1">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-atlantis-bg-main text-atlantis-white px-2 py-1">
                              TURNO #{shift.id}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-atlantis-primary">
                              {shift.zoneNombre}
                            </span>
                          </div>
                          <h3 className="font-syne font-black text-xl md:text-2xl uppercase tracking-tighter mt-3">
                            {shift.descripcionTarea || 'ASIGNACIÓN GENERAL'}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex flex-row md:flex-col gap-4 md:gap-2 shrink-0 md:text-right">
                        <div className="flex items-center gap-2 text-atlantis-bg-main/60 md:justify-end">
                          <Clock size={14} className="text-atlantis-primary" />
                          <span className="font-plex font-bold text-xs uppercase tracking-widest">
                            INICIO: {new Date(shift.horaInicio).toLocaleString('es-ES', { hour: '2-digit', minute:'2-digit', day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-atlantis-bg-main/60 md:justify-end">
                          <Clock size={14} />
                          <span className="font-plex font-bold text-xs uppercase tracking-widest">
                            FIN: {new Date(shift.horaFin).toLocaleString('es-ES', { hour: '2-digit', minute:'2-digit', day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-atlantis-bg-main/20 p-12 text-center">
                <p className="font-plex font-bold text-sm uppercase tracking-widest text-atlantis-bg-main/40">
                  NO TIENES TURNOS ASIGNADOS
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
