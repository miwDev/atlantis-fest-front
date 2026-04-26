import { motion } from 'framer-motion';
import heroBg from '../../../assets/heroBg.png';
import phoneImg from '../../../assets/phone.png';

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] flex flex-col md:flex-row overflow-hidden border-y border-atlantis-bg-main mb-24">
      
      <div className="w-full md:w-[60%] h-1/2 md:h-full relative border-b md:border-b-0 md:border-r border-atlantis-bg-main bg-atlantis-bg-alt">
        <img 
          src={heroBg} 
          alt="Atlantis Hero" 
          className="w-full h-full object-cover opacity-90 mix-blend-screen"
        />
        <div className="absolute top-4 left-4 font-plex text-[10px] uppercase tracking-[0.2em] text-atlantis-white mix-blend-difference font-bold hidden md:block">
          WORK BY ATLANTIS
        </div>
        <div className="absolute top-4 right-8 font-plex text-[10px] uppercase tracking-[0.2em] text-atlantis-white mix-blend-difference font-bold hidden md:block">
          PROJECTS 2026
        </div>
      </div>

      <div className="w-full md:w-[40%] h-1/2 md:h-full bg-atlantis-white flex flex-col relative py-6 px-8 md:py-12 md:px-16">
        <div className="flex justify-between items-center w-full font-plex text-[10px] uppercase tracking-widest mb-8 md:mb-24">
          <span className="font-bold">WORK WITH US</span>
          <span>10:06:42</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 md:gap-4 mt-24 md:mt-48 mb-auto max-w-lg w-full mx-auto items-center">
          {['MAGAZINE', 'ARTIST FUND', 'ABOUT US'].map((item, idx) => (
            <button key={`r1-${idx}`} className="w-full py-3 md:py-4 rounded-[2rem] border-[1.5px] border-atlantis-bg-main text-[8px] md:text-[9px] font-bold uppercase tracking-[0.1em] hover:bg-atlantis-bg-main hover:text-atlantis-white transition-colors flex items-center justify-center text-center leading-tight">
              {item}
            </button>
          ))}
          <button className="w-full py-3 md:py-4 rounded-[2rem] border-[1.5px] border-atlantis-bg-main text-[8px] md:text-[9px] font-bold uppercase tracking-[0.1em] hover:bg-atlantis-bg-main hover:text-atlantis-white transition-colors flex items-center justify-center text-center leading-tight">
            GITHUB
          </button>
          <div className="flex items-center justify-center pointer-events-none hover:scale-110 transition-transform duration-500">
             <img src={phoneImg} alt="Retro Phone" className="w-12 md:w-16 object-contain drop-shadow-2xl" />
          </div>
          <button className="w-full py-3 md:py-4 rounded-[2rem] border-[1.5px] border-atlantis-bg-main text-[8px] md:text-[9px] font-bold uppercase tracking-[0.1em] hover:bg-atlantis-bg-main hover:text-atlantis-white transition-colors flex items-center justify-center text-center leading-tight">
            SERVICES
          </button>
          {['PROJECTS', 'DESIGN STORE', 'INSTAGRAM'].map((item, idx) => (
            <button key={`r3-${idx}`} className="w-full py-3 md:py-4 rounded-[2rem] border-[1.5px] border-atlantis-bg-main text-[8px] md:text-[9px] font-bold uppercase tracking-[0.1em] hover:bg-atlantis-bg-main hover:text-atlantis-white transition-colors flex items-center justify-center text-center leading-tight">
              {item}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-atlantis-bg-main/20 font-plex text-[8px] md:text-[10px] text-center text-atlantis-secondary font-bold uppercase tracking-[0.2em]">
          ATLANTIS FEST 2026 BCN MUSIC
        </div>
      </div>
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="absolute top-12 md:top-24 left-0 w-full pointer-events-none z-10"
      >
        <h1 className="font-syne text-[16vw] md:text-[11.5vw] leading-[0.75] font-black uppercase tracking-tighter text-atlantis-bg-main mix-blend-normal whitespace-nowrap -ml-2 md:-ml-8">
          ATLANTIS
        </h1>
      </motion.div>

    </section>
  );
};
