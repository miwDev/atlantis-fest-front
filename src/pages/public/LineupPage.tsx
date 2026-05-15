import { useState, useEffect } from 'react';
import { artistService } from '../../services/artist.service';
import type { ArtistOutputDTO } from '../../types/output.dto';
import defaultArtistPhoto from '../../assets/defaultArtist.png';

export const LineupPage = () => {
  const [artists, setArtists] = useState<ArtistOutputDTO[]>([]);
  const [hoveredArtist, setHoveredArtist] = useState<ArtistOutputDTO | null>(null);
  const [imagePos, setImagePos] = useState({ top: '50%', left: '75%' });

  const handleMouseEnter = (artist: ArtistOutputDTO) => {
    setImagePos({
      top: `${Math.floor(Math.random() * 60) + 20}%`,
      left: `${Math.floor(Math.random() * 30) + 55}%`
    });
    setHoveredArtist(artist);
  };

  useEffect(() => {
    artistService.getAll(0, 100).then((data) => {
      // Orden aleatorio de los artistas
      const shuffled = [...data.content].sort(() => 0.5 - Math.random());
      setArtists(shuffled);
    }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-atlantis-white pt-32 pb-24 px-6 md:px-16 relative overflow-hidden">
      
      {/* Imagen descentrada, en posición aleatoria por debajo del texto */}
      {hoveredArtist && (
        <div
          className="fixed -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
          style={imagePos}
        >
          <img 
            src={hoveredArtist.fotoUrl || defaultArtistPhoto} 
            alt={hoveredArtist.artistName || hoveredArtist.name}
            className="w-[200px] h-[280px] md:w-[280px] md:h-[380px] lg:w-[350px] lg:h-[480px] object-cover shadow-2xl"
          />
        </div>
      )}

      {/* Lista de artistas por la izquierda en bajada */}
      <div className="flex flex-col items-start z-10 relative">
        {artists.map((artist) => (
          <div
            key={artist.id}
            onMouseEnter={() => handleMouseEnter(artist)}
            onMouseLeave={() => setHoveredArtist(null)}
            className="font-syne text-[1.75rem] md:text-[3rem] lg:text-[4rem] font-normal uppercase leading-[0.9] text-atlantis-bg-main cursor-pointer transition-colors duration-300 hover:text-atlantis-primary hover:italic hover:font-bold mb-4"
          >
            {artist.artistName || artist.name}
          </div>
        ))}
      </div>
      
    </div>
  );
};
