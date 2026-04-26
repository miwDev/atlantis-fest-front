import { motion } from 'framer-motion';

export const VideoSection = () => {
  return (
    <section className="flex flex-col justify-center border-b border-atlantis-bg-main pb-16 mb-16">
      {/* Small editorial header */}
      <div className="flex justify-between items-center mb-6">
        <span className="font-plex text-[10px] uppercase tracking-[0.3em] font-bold">01 // CAMPAIGN</span>
        <span className="font-plex text-[10px] uppercase tracking-[0.3em] font-bold text-atlantis-secondary">PLAY TEASER</span>
      </div>

      {/* Video Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full aspect-video bg-atlantis-bg-alt relative overflow-hidden group cursor-pointer border border-atlantis-bg-main"
      >
        {/* Placeholder video element */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale contrast-[1.2]"
          poster="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=3174&auto=format&fit=crop"
        >
          {/* MP4 de prueba como placeholder */}
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-atlantis-white flex items-center justify-center text-atlantis-white group-hover:scale-110 transition-transform duration-500 backdrop-blur-sm bg-atlantis-bg-main/20">
            <span className="font-syne font-black ml-2 text-xl md:text-2xl">▶</span>
          </div>
        </div>
        
        {/* Etiqueta de grabación */}
        <div className="absolute top-6 left-6 flex items-center gap-2 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span className="font-plex text-[10px] font-bold text-atlantis-white tracking-widest uppercase">REC</span>
        </div>
      </motion.div>
      
      {/* Caption */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <h2 className="font-syne text-h5 md:text-h4 font-black uppercase tracking-tighter">ATLANTIS PREVIEW</h2>
        <p className="font-plex text-[10px] md:text-xs uppercase tracking-widest text-atlantis-secondary max-w-xs md:text-right">
          Visual concept directed by Studio. Madrid, 2026.
        </p>
      </div>
    </section>
  );
};
