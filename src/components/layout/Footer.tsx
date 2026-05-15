import { Link } from 'react-router-dom';
import logoClaro from '../../assets/logo-light.svg';
import logoOscuro from '../../assets/logo-dark.svg';

export const Footer = () => {
  return (
    <footer className="w-full bg-atlantis-primary py-12 px-6 md:px-12 mt-auto z-[100] relative border-t-4 border-atlantis-bg-main">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* IZQUIERDA: Logo e Info */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link to="/">
            <img src={logoClaro} alt="Atlantis Logo" className="h-16 w-16 md:h-20 md:w-20 object-contain hover:scale-105 transition-transform" />
          </Link>
          <Link to="/">
            <img 
              src={logoOscuro} 
              alt="Atlantis Protocol Dark" 
              className="h-12 w-12 md:h-16 md:w-16 object-contain mt-2 hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
        
        {/* CENTRO/DERECHA: Enlaces */}
        <div className="flex flex-col gap-3 font-syne text-atlantis-white text-h5 md:text-h4 font-black uppercase tracking-tighter text-center md:text-right">
          <Link to="/tickets" className="hover:text-atlantis-bg-main transition-colors">TICKETS</Link>
          <Link to="/info" className="hover:text-atlantis-bg-main transition-colors">INFO & FAQS</Link>
          <Link to="/legal" className="hover:text-atlantis-bg-main transition-colors">LEGAL</Link>
        </div>
      </div>
      
      {/* BOTTOM: Copyright */}
      <div className="mt-12 pt-6 border-t border-atlantis-white/30 flex justify-between items-center text-atlantis-white font-plex text-[10px] uppercase tracking-[0.2em]">
        <span>© 2026 ATLANTIS FEST</span>
        <span>MADRID, ES</span>
      </div>
    </footer>
  );
};
