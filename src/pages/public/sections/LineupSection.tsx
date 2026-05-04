import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import defaultArtist from '../../../assets/defaultArtist.png';
import { artistService } from '../../../services/artist.service';
import type { ArtistOutputDTO } from '../../../types/output.dto';

export const LineupSection = () => {
  const [artists, setArtists] = useState<ArtistOutputDTO[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<ArtistOutputDTO | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await artistService.getAll(0, 100);
        setArtists(res.content);
      } catch (err) {
        console.error("Error fetching artists", err);
      }
    };
    fetchArtists();
  }, []);

  return (
    <section className="mb-32">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {Array.from({ length: 8 }).map((_, index) => {
          const artist = artists[index];
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => artist && setSelectedArtist(artist)}
              className="flex flex-col items-center pb-8 cursor-pointer"
            >
              <div className="w-full aspect-[4/3] bg-atlantis-bg-alt mb-6 overflow-hidden group">
                {artist ? (
                  <img 
                    src={artist.fotoUrl || defaultArtist} 
                    alt={artist.artistName} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full bg-atlantis-bg-main flex items-center justify-center">
                    <span className="font-plex text-atlantis-white text-h2 font-bold">?</span>
                  </div>
                )}
              </div>
              
              <h3 className="font-plex font-bold text-sm md:text-base uppercase tracking-widest mb-3 text-center">
                {artist ? artist.artistName : '?'}
              </h3>
            </motion.div>
          );
        })}
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
