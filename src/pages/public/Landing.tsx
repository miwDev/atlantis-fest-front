import { HeroSection } from './sections/HeroSection';
import { LineupSection } from './sections/LineupSection';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div className="bg-atlantis-white text-atlantis-bg-main min-h-screen flex flex-col w-full">
      <HeroSection />
      <div className="container mx-auto max-w-7xl px-8 md:px-24">
        <LineupSection />

        {/* Banner Mapa Interactivo */}
        <div className="w-full mb-24 mt-12">
          <Link 
            to="/mapa"
            className="group block w-full border border-atlantis-bg-main relative overflow-hidden bg-atlantis-bg-alt/5 hover:bg-atlantis-primary transition-colors duration-500 p-8 md:p-16 flex flex-col items-center justify-center text-center"
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-atlantis-bg-main to-transparent mix-blend-overlay group-hover:opacity-30 transition-opacity duration-500"></div>
            
            <span className="font-plex text-atlantis-primary group-hover:text-atlantis-bg-main text-xs uppercase tracking-[0.4em] font-bold block mb-4 transition-colors duration-500">
              EXPLORE THE GROUNDS
            </span>
            <h2 className="font-syne font-black text-3xl md:text-5xl uppercase tracking-[0.2em] text-atlantis-bg-main group-hover:text-atlantis-white mb-8 transition-colors duration-500 relative z-10">
              MAPA INTERACTIVO
            </h2>
            
            <div className="flex items-center gap-4 text-atlantis-bg-main group-hover:text-atlantis-white transition-colors duration-500 font-plex font-bold uppercase tracking-widest text-sm relative z-10">
              <span>ABRIR MAPA</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-2 transition-transform duration-500">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
