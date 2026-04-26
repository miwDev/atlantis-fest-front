import { motion } from 'framer-motion';
import loginBG from '../../../assets/LoginBG.png';

const lineupData = [
  { name: 'RUSOWSKY', date: '19.9.26' },
  { name: 'YUNG BEEF', date: '18.9.26' },
  { name: 'LA PLAZUELA', date: '19.9.26' },
  { name: 'MVRK', date: '18.9.26' },
  { name: 'MUSHKA', date: '18.9.26' },
  { name: '?', date: '' },
  { name: '8BELIAL', date: '18.9.26' },
  { name: 'AKRIILA', date: '18.9.26' }
];

export const LineupSection = () => {
  return (
    <section className="mb-32">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {lineupData.map((artist, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center border-b border-dotted border-atlantis-secondary/50 pb-8"
          >
            <div className="w-full aspect-[4/3] bg-atlantis-bg-alt mb-6 overflow-hidden group">
              {artist.name !== '?' ? (
                <img 
                  src={loginBG} 
                  alt={artist.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              ) : (
                <div className="w-full h-full bg-atlantis-bg-main flex items-center justify-center">
                   <span className="font-plex text-atlantis-white text-h2 font-bold">?</span>
                </div>
              )}
            </div>
            
            <h3 className="font-plex font-bold text-sm md:text-base uppercase tracking-widest mb-3 text-center">
              {artist.name}
            </h3>
            
            {artist.name !== '?' && (
              <div className="flex flex-col items-center font-plex text-[10px] md:text-xs text-atlantis-secondary">
                <div className="flex gap-2 mb-1 underline decoration-atlantis-secondary/40 underline-offset-4">
                  <a href="#" className="hover:text-atlantis-bg-main transition-colors">Spotify</a>
                  <a href="#" className="hover:text-atlantis-bg-main transition-colors">YT</a>
                  <a href="#" className="hover:text-atlantis-bg-main transition-colors">IG</a>
                </div>
                <span className="font-bold tracking-widest text-atlantis-bg-main mt-1">{artist.date}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
