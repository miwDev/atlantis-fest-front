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
      if (!user?.id) return;
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
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-16 md:-right-40 w-[21rem] md:w-[33.6rem] h-auto opacity-10 pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg1} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="container mx-auto max-w-6xl px-8 relative z-10">
        <div className="mb-16 border-b-2 border-atlantis-bg-main pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-atlantis-bg-main text-atlantis-white p-2">
              <Calendar size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">TU AGENDA</span>
          </div>
          <h1 className="font-syne font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-4">
            MIS CONCIERTOS<span className="text-atlantis-primary">.</span>
          </h1>
          <p className="font-plex text-sm uppercase tracking-widest text-atlantis-bg-main/60">
            Consulta tus horarios y la ubicación de tus actuaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Section 1: Map Placeholder */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-8">
              <MapIcon size={24} />
              <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter">MAPA DEL RECINTO</h2>
            </div>
            <div className="aspect-video bg-atlantis-white border-2 border-atlantis-bg-main flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 border-2 border-dashed border-atlantis-bg-main/20 flex items-center justify-center mb-6">
                <span className="font-syne font-black text-2xl text-atlantis-bg-main/20">#TODO</span>
              </div>
              <p className="text-xs font-black uppercase tracking-widest opacity-40">Mapa Interactivo del Festival</p>
              <p className="text-[10px] uppercase tracking-widest opacity-20 mt-4 max-w-md">
                Próximamente podrás ver la ubicación exacta de tus escenarios y accesos de servicio.
              </p>
            </div>
          </div>

          {/* Section 2: Concert List */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-8">
              <Music size={24} />
              <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter">HORARIOS</h2>
            </div>

            {loading ? (
              <div className="border-2 border-dashed border-atlantis-bg-main/20 p-12 text-center text-[10px] uppercase tracking-widest opacity-40">
                Sincronizando...
              </div>
            ) : concerts.length > 0 ? (
              <div className="space-y-4">
                {concerts.map(c => (
                  <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-atlantis-white border-2 border-atlantis-bg-main p-6 hover:bg-atlantis-primary/5 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2 text-atlantis-primary">
                        <Clock size={16} />
                        <span className="font-plex font-bold text-sm">{c.horaInicio} - {c.horaFin}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{c.fecha}</span>
                    </div>
                    <h3 className="font-syne font-black text-2xl uppercase tracking-tighter leading-none mb-2 group-hover:text-atlantis-primary transition-colors">
                      {c.artistName}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">ESCENARIO: {c.zoneName}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-atlantis-bg-main p-8 text-center opacity-40">
                <p className="text-xs font-black uppercase tracking-widest">No tienes actuaciones programadas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
