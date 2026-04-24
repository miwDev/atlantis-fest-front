import logoClaro from '../../assets/logo-light.svg';

export const Footer = () => {
  return (
    <footer className="w-full bg-atlantis-primary py-12 px-6 md:px-12 mt-auto z-[100] relative border-t-4 border-atlantis-bg-main">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* IZQUIERDA: Logo e Info */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <img src={logoClaro} alt="Atlantis Logo" className="h-16 w-16 md:h-20 md:w-20 object-contain" />
          <p className="font-plex text-atlantis-white text-[10px] uppercase tracking-[0.3em] text-center md:text-left mt-2">
            Atlantis_Protocol_v2.4<br/>System_Operational
          </p>
        </div>
        
        {/* CENTRO/DERECHA: Enlaces */}
        <div className="flex flex-col gap-3 font-syne text-atlantis-white text-h5 md:text-h4 font-black uppercase tracking-tighter text-center md:text-right">
          <a href="#" className="hover:text-atlantis-bg-main transition-colors">TICKETS</a>
          <a href="#" className="hover:text-atlantis-bg-main transition-colors">INFO & FAQS</a>
          <a href="#" className="hover:text-atlantis-bg-main transition-colors">LEGAL</a>
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
