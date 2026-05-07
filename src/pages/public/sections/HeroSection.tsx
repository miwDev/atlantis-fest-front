import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroBg from '../../../assets/heroBg.png';
import phoneImg from '../../../assets/phone.png';
import ScrambleHover from '../../../components/common/ScrambleHover';
import CircularText from '../../../components/common/CircularText';


export const HeroSection = () => {
  const announcements = [
    { text: 'ROSALÍA', state: 'CONFIRMED' },
    { text: 'SECRET ARTIST', state: 'TBA' },
    { text: 'C. TANGANA', state: 'CONFIRMED' },
    { text: 'MYSTERY GUEST', state: 'TBA' },
    { text: 'BAD GYAL', state: 'CONFIRMED' },
    { text: 'TO BE ANNOUNCED', state: 'TBA' },
    { text: 'QUEVEDO', state: 'CONFIRMED' }
  ];

  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] flex flex-col md:flex-row overflow-hidden border-y border-atlantis-bg-main mb-24 bg-atlantis-white">
      
      {/* Left side: Background Image with Original Color */}
      <div className="w-full md:w-[60%] h-1/2 md:h-full relative border-b md:border-b-0 md:border-r border-atlantis-bg-main bg-atlantis-bg-alt">
        <img 
          src={heroBg} 
          alt="Atlantis Hero" 
          className="w-full h-full object-cover opacity-100 transition-all duration-1000"
        />
        <div className="absolute top-4 left-4 font-plex text-[10px] uppercase tracking-[0.2em] text-atlantis-white mix-blend-difference font-bold hidden md:block">
          ATLANTIS FESTIVAL
        </div>
        <div className="absolute top-4 right-8 font-plex text-[10px] uppercase tracking-[0.2em] text-atlantis-white mix-blend-difference font-bold hidden md:block">
          EDITION 2026
        </div>
      </div>

      {/* Right side: Blank content area */}
      <div className="w-full md:w-[40%] h-1/2 md:h-full bg-atlantis-white flex flex-col relative py-6 px-8 md:py-12 md:px-16">
        <div className="flex justify-between items-center w-full font-plex text-[10px] uppercase tracking-widest mb-8 md:mb-16">
          <span className="font-bold text-atlantis-bg-main">EXPERIMENTAL UNIT</span>
          <span className="text-atlantis-secondary italic">LIVE FEED</span>
        </div>
        
        {/* Interactive Buy Tickets Component */}
        <div className="flex-grow flex items-end justify-center pb-16 md:pb-24">
          <Link to="/tickets" className="relative flex items-center justify-center w-[200px] h-[200px] md:w-[260px] md:h-[260px] group cursor-pointer z-20">
            <CircularText 
              text="BUY TICKETS NOW • BUY TICKETS NOW • " 
              className="absolute inset-0 w-full h-full text-atlantis-primary text-[10px] md:text-sm"
              radius={100}
            />
            <img 
              src={phoneImg} 
              alt="Buy Tickets" 
              className="absolute z-10 w-20 md:w-28 drop-shadow-2xl group-hover:scale-125 transition-transform duration-500 ease-out" 
            />
          </Link>
        </div>

        <div className="mt-auto pt-6 border-t border-atlantis-bg-main/20 font-plex text-[8px] md:text-[10px] text-center text-atlantis-secondary font-bold uppercase tracking-[0.2em]">
          SYSTEM STATUS: NOMINAL // ATLANTIS FEST 2026
        </div>
      </div>
      
      {/* Absolute Header with Scramble Effect */}
      <div 
        className="absolute top-12 md:top-24 left-0 w-full pointer-events-none z-10 px-4 md:px-8"
      >
        <h1 className="font-syne text-[16vw] md:text-[11.5vw] leading-[0.75] font-black uppercase tracking-tighter text-atlantis-bg-main mix-blend-normal whitespace-nowrap -ml-2 md:-ml-8 cursor-default pointer-events-auto">
          <ScrambleHover 
            text="ATLANTIS"
            scrambleSpeed={30}
            maxIterations={50}
            sequential={true}
            revealDirection="start"
            useOriginalCharsOnly={false}
            className="font-syne"
            scrambledClassName="text-atlantis-primary opacity-50"
            scrambleOnMount={true}
          />
        </h1>
      </div>

    </section>
  );
};
