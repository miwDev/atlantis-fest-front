import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import defaultArtist from '../../../assets/defaultArtist.png';
import { artistService } from '../../../services/artist.service';
import { socialMediaService } from '../../../services/social-media.service';
import { concertService } from '../../../services/concert.service';
import type { ArtistOutputDTO, SocialMediaOutputDTO, ConcertOutputDTO } from '../../../types/output.dto';
import { Instagram, Youtube, Music, Globe, Twitter, Calendar } from 'lucide-react';

export const LineupSection = () => {
  const [artists, setArtists] = useState<ArtistOutputDTO[]>([]);
  const [socials, setSocials] = useState<SocialMediaOutputDTO[]>([]);
  const [concerts, setConcerts] = useState<ConcertOutputDTO[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<ArtistOutputDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsRes, socialsRes, concertsRes] = await Promise.all([
          artistService.getAll(0, 100).catch(() => ({ content: [] })),
          socialMediaService.getAll(0, 500).catch(() => ({ content: [] })),
          concertService.getAll(0, 500).catch(() => ({ content: [] }))
        ]);
        setArtists(artistsRes?.content || []);
        setSocials(socialsRes?.content || []);
        setConcerts(concertsRes?.content || []);
      } catch (err) {
        console.error("Error fetching lineup data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSocialIcon = (tipo: string | undefined) => {
    if (!tipo) return <Globe size={14} />;
    const t = tipo.toUpperCase();
    if (t.includes('INSTAGRAM')) return <Instagram size={14} />;
    if (t.includes('YOUTUBE')) return <Youtube size={14} />;
    if (t.includes('SPOTIFY')) return <Music size={14} />;
    if (t.includes('TWITTER')) return <Twitter size={14} />;
    return <Globe size={14} />;
  };

  const formatDateShort = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${day}:${month}`;
    } catch {
      return '';
    }
  };

  return (
    <section className="mb-32">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col animate-pulse">
              <div className="w-full aspect-[4/5] bg-atlantis-bg-main/5 mb-8" />
              <div className="h-6 w-3/4 bg-atlantis-bg-main/5 mb-4" />
              <div className="h-4 w-1/2 bg-atlantis-bg-main/5" />
            </div>
          ))
        ) : artists.length > 0 ? (
          artists.map((artist, index) => {
            const artistSocials = socials.filter(s => s && s.artistName === artist.artistName).slice(0, 3);
            const artistConcert = concerts.find(c => c && c.artistName === artist.artistName);
            
            return (
              <motion.div 
                key={artist.id || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col group"
              >
                <div 
                  className="w-full aspect-[4/5] bg-atlantis-bg-alt mb-8 overflow-hidden relative cursor-pointer"
                  onClick={() => setSelectedArtist(artist)}
                >
                  <img 
                    src={artist.fotoUrl || defaultArtist} 
                    alt={artist.artistName || 'Artist'} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                  />
                  
                  {artistConcert && (
                    <div className="absolute top-4 left-4 bg-atlantis-bg-main text-atlantis-white px-3 py-1 flex items-center gap-2">
                      <Calendar size={10} className="text-atlantis-primary" />
                      <span className="font-syne font-black text-[9px] uppercase tracking-widest">
                        {formatDateShort(artistConcert.fecha)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 
                    className="font-syne font-black text-2xl uppercase tracking-tighter leading-none cursor-pointer group-hover:text-atlantis-primary transition-colors"
                    onClick={() => setSelectedArtist(artist)}
                  >
                    {artist.artistName || 'UNKNOWN'}
                  </h3>
                  
                  <div className="flex items-center gap-4">
                    {artistSocials.map(s => (
                      <a 
                        key={s.id} 
                        href={s.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-atlantis-bg-main opacity-20 hover:opacity-100 hover:text-atlantis-primary transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {getSocialIcon(s.tipo)}
                      </a>
                    ))}
                    {artistSocials.length === 0 && (
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-10">ATLANTIS_EXCLUSIVE</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className="col-span-full py-20 text-center opacity-20 uppercase tracking-[0.5em] font-syne font-black italic text-sm">
            [ NO_ARTIST_DATA_FOUND ]
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedArtist && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArtist(null)}
            className="fixed inset-0 z-[100] flex justify-center p-0 bg-atlantis-white/80 backdrop-blur-3xl cursor-pointer overflow-y-auto"
          >
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl w-full flex flex-col items-center pt-24 pb-32 px-8 md:px-12"
            >
              {/* Artist Name - Extremely minimal at the top */}
              <h2 className="font-syne font-black text-2xl md:text-3xl uppercase tracking-[0.5em] text-atlantis-bg-main text-center mb-16">
                {selectedArtist.artistName}
              </h2>

              {/* Biography - The hero of the view */}
              <div className="max-w-3xl">
                <p className="font-plex text-sm md:text-2xl leading-[1.6] text-atlantis-bg-main uppercase tracking-widest text-center font-medium">
                  {selectedArtist.biography || "No hay biografía disponible para este artista en este momento. Prepárate para una actuación legendaria en el escenario principal del AtlantisFest."}
                </p>
              </div>

              {/* Subtle indicator at the very bottom of the content */}
              <div className="mt-24 flex flex-col items-center gap-4 opacity-20">
                <div className="w-px h-12 bg-atlantis-bg-main" />
                <span className="text-[8px] font-black uppercase tracking-[0.6em]">VOLVER</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
