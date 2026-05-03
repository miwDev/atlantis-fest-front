import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import defaultArtist from '../../../assets/defaultArtist.png';
import { artistService } from '../../../services/artist.service';
import type { ArtistOutputDTO } from '../../../types/output.dto';

export const LineupSection = () => {
  const [artists, setArtists] = useState<ArtistOutputDTO[]>([]);

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
            className="flex flex-col items-center border-b border-dotted border-atlantis-secondary/50 pb-8"
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
            
            {artist && (
              <div className="flex flex-col items-center font-plex text-[10px] md:text-xs text-atlantis-secondary">
                {/* TODO: Implementar enlaces reales de redes sociales del artista */}
                <div className="flex gap-2 mb-1 underline decoration-atlantis-secondary/40 underline-offset-4">
                  <a href="#" className="hover:text-atlantis-bg-main transition-colors">Spotify</a>
                  <a href="#" className="hover:text-atlantis-bg-main transition-colors">YT</a>
                  <a href="#" className="hover:text-atlantis-bg-main transition-colors">IG</a>
                </div>
              </div>
            )}
          </motion.div>
          );
        })}
      </div>
    </section>
  );
};
