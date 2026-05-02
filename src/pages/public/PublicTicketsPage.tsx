import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTickets } from '../../hooks/useTickets';
import ticketImg1 from '../../assets/ticket1.webp';
import ticketImg2 from '../../assets/ticket2.webp';
import { ticketTypeService } from '../../services/ticket-type.service';
import { Link, useNavigate } from 'react-router-dom';

export const PublicTicketsPage = () => {
  const { tickets, loading, error, getTickets } = useTickets();
  const navigate = useNavigate();

  useEffect(() => {
    getTickets(0, 100);
  }, []);

  return (
    <div className="bg-atlantis-white text-atlantis-bg-main min-h-screen pt-32 pb-24 font-plex selection:bg-atlantis-primary selection:text-atlantis-bg-main relative overflow-hidden">
      
      {/* Off-center Background Resource */}
      <div className="absolute top-1/4 -left-16 md:-left-40 w-[21rem] md:w-[33.6rem] h-auto opacity-60 pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg2} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="container mx-auto max-w-6xl px-8 md:px-16 relative z-10">
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 font-plex font-bold uppercase tracking-widest text-atlantis-secondary hover:text-atlantis-primary transition-colors mb-16"
        >
          <span>←</span> Volver
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <h1 className="font-syne font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none text-atlantis-bg-main">
              TICKETS<span className="text-atlantis-primary">.</span>
            </h1>
            <p className="font-plex text-sm md:text-base uppercase tracking-[0.2em] text-atlantis-secondary max-w-md border-l-2 border-atlantis-primary pl-4 py-1">
              Asegura tu pase al evento del año. El aforo es estricto y la disponibilidad está limitada.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative hidden lg:block aspect-video lg:aspect-[4/3] overflow-hidden"
          >
            <img 
              src={ticketImg1} 
              alt="Brutalist Architecture" 
              className="w-full h-full object-cover grayscale opacity-90"
            />
          </motion.div>
        </div>

        {error && (
          <div className="mb-12 p-4 border-2 border-atlantis-error bg-atlantis-white text-atlantis-error font-plex font-black uppercase tracking-widest text-xs">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center font-plex font-bold uppercase tracking-[0.3em] text-atlantis-bg-main py-32 border-4 border-dashed border-atlantis-bg-main/20">
            [ Cargando inventario... ]
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {tickets.map((ticket, index) => {
              const isSoldOut = ticket.maxDisponible === 0;
              
              return (
                <motion.div 
                  key={ticket.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col bg-atlantis-white transition-all duration-300 ${
                    isSoldOut 
                    ? 'border border-dashed border-atlantis-secondary/40 opacity-70' 
                    : 'border border-atlantis-bg-main/20 hover:border-atlantis-bg-main hover:shadow-lg'
                  }`}
                >
                  <div className="p-8 md:p-12 flex-1 flex flex-col justify-between z-10">
                    <div>
                      <div className="flex flex-row justify-between items-start mb-8 gap-4">
                        <h2 className={`flex-1 min-w-0 font-syne font-black text-3xl md:text-4xl uppercase tracking-tighter leading-none break-words ${isSoldOut ? 'text-atlantis-secondary' : 'text-atlantis-bg-main'}`}>
                          {ticket.tipo}
                        </h2>
                        <span className={`shrink-0 font-plex text-2xl font-bold pt-1 ${isSoldOut ? 'text-atlantis-secondary/50' : 'text-atlantis-bg-main'}`}>
                          {ticket.precioBase}€
                        </span>
                      </div>
                      
                      <p className={`font-plex text-xs md:text-sm uppercase tracking-widest leading-relaxed mb-12 ${isSoldOut ? 'text-atlantis-secondary' : 'text-atlantis-bg-alt/80'}`}>
                        {ticket.descripcion || "Acceso general al recinto y zonas comunes."}
                      </p>
                    </div>

                    <button 
                      disabled={isSoldOut}
                      onClick={() => navigate(`/checkout/${ticket.id}`)}
                      className={`w-full py-5 font-plex font-bold uppercase tracking-[0.3em] text-xs transition-colors ${
                        isSoldOut 
                        ? 'bg-transparent border border-dashed border-atlantis-secondary/50 text-atlantis-secondary cursor-not-allowed' 
                        : 'bg-atlantis-bg-main text-atlantis-white hover:bg-atlantis-primary hover:text-atlantis-bg-main border border-transparent'
                      }`}
                    >
                      {isSoldOut ? 'SOLD OUT' : 'COMPRAR'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
