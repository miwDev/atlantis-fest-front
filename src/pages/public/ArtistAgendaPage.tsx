import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { artistService } from '../../services/artist.service';
import type { ConcertOutputDTO } from '../../types/output.dto';
import { Calendar, Clock, Map as MapIcon, Music } from 'lucide-react';
import ticketImg1 from '../../assets/ticket1.webp';

export const ArtistAgendaPage = () => {
  const { user } = useAuthStore();
  const [concerts, setConcerts] = useState<ConcertOutputDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConcerts = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        // We assume the logged in user ID matches the artist ID
        const res = await artistService.getConcertsByArtist(user.id, 0, 50);
        setConcerts(res.content);
      } catch (err) {
        console.error("Error fetching artist concerts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConcerts();
  }, [user]);

  return (
    <div className="min-h-screen bg-atlantis-white text-atlantis-bg-main font-plex relative overflow-hidden pt-32 pb-24">
      
      {/* Background Decor Resources - Adjusted for better readability */}
      <div className="absolute top-1/4 -right-32 md:-right-60 w-[21rem] md:w-[33.6rem] h-auto opacity-[0.08] pointer-events-none mix-blend-multiply z-0">
        <img src="/src/assets/ticket2.webp" alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="absolute bottom-0 -left-32 md:-left-60 w-[21rem] md:w-[33.6rem] h-auto opacity-[0.08] pointer-events-none mix-blend-multiply z-0">
        <img src="/src/assets/ticket1.webp" alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="container mx-auto max-w-6xl px-8 relative z-10">
        {/* Header - Premium Minimalist */}
        <div className="mb-24 border-b border-atlantis-bg-main/10 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-atlantis-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">PLANIFICACIÓN Y LOGÍSTICA</span>
          </div>
          <h1 className="font-syne font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-6">
            MI AGENDA<span className="text-atlantis-primary">.</span>
          </h1>
          <p className="font-plex text-sm md:text-base uppercase tracking-widest text-atlantis-bg-main/40 max-w-2xl leading-relaxed">
            Consulta tus horarios confirmados, escenarios asignados y la ubicación técnica en el recinto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Section 1: Map Placeholder */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="flex flex-col gap-10">
              <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter border-b border-atlantis-bg-main pb-4">
                MAPA_RECINTO
              </h2>
              <div className="aspect-video bg-atlantis-bg-main/[0.02] border border-atlantis-bg-main/5 flex flex-col items-center justify-center p-12 text-center relative group overflow-hidden">
                {/* Blueprint Grid Decor */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div className="grid grid-cols-8 h-full w-full">
                    {Array.from({ length: 32 }).map((_, i) => <div key={i} className="border-r border-b border-atlantis-bg-main" />)}
                  </div>
                </div>

                <div className="w-24 h-24 border border-atlantis-bg-main/10 flex items-center justify-center mb-8 relative z-10">
                  <span className="font-syne font-black text-3xl text-atlantis-bg-main/10 italic">MAP</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 relative z-10">COORDENADAS EN PROCESO</p>
                <p className="text-[10px] uppercase tracking-widest opacity-20 max-w-xs leading-relaxed relative z-10">
                  ESTAMOS SINCRONIZANDO LOS ESCENARIOS CON LA ÚLTIMA VERSIÓN DEL PLANO DEL FESTIVAL.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Concert List */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-12">
            <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter border-b border-atlantis-bg-main pb-4">
              CONCIERTOS_HORARIOS
            </h2>

            {loading ? (
              <div className="py-20 text-center text-[10px] font-black uppercase tracking-[0.4em] opacity-20 animate-pulse italic">
                [ SINCRONIZANDO_DATOS ]
              </div>
            ) : concerts.length > 0 ? (
              <div className="divide-y divide-atlantis-bg-main/5">
                {concerts.map(c => (
                  <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ x: 5 }}
                    className="py-10 group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4 text-atlantis-primary">
                        <Clock size={18} />
                        <span className="font-syne font-black text-xl italic">{c.horaInicio} — {c.horaFin}</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-atlantis-bg-main/30 bg-atlantis-bg-main/5 px-2 py-0.5">{c.fecha}</span>
                    </div>
                    <h3 className="font-syne font-black text-3xl md:text-4xl uppercase tracking-tighter leading-none mb-4 group-hover:text-atlantis-primary transition-colors">
                      {c.artistName}
                    </h3>
                    <div className="flex items-center gap-2">
                       <div className="w-4 h-[1px] bg-atlantis-primary" />
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">ESCENARIO: {c.zoneName}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 border border-dashed border-atlantis-bg-main/10 flex flex-col items-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-20 italic">[ NO HAY ACTUACIONES ASIGNADAS ]</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
