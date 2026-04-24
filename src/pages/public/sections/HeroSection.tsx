import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <section className="min-h-[40vh] flex flex-col justify-center border-b border-atlantis-bg-main pb-16 mb-16 relative">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full text-center md:text-left"
      >
        <h1 className="font-syne text-[10vw] md:text-[8vw] leading-[0.9] font-black uppercase tracking-tighter text-atlantis-bg-main">
          ATLANTIS FEST
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mt-8 border-t border-atlantis-secondary/30 pt-4">
          <p className="font-plex text-xs md:text-sm tracking-widest uppercase text-atlantis-secondary max-w-lg">
            La convergencia de la tecnología y el arte sonoro. Edición 2026.
          </p>
          <div className="font-plex text-[10px] md:text-xs uppercase tracking-[0.2em] text-atlantis-primary mt-4 md:mt-0 font-bold">
            18-20 SEPTIEMBRE / MADRID
          </div>
        </div>
      </motion.div>
    </section>
  );
};
