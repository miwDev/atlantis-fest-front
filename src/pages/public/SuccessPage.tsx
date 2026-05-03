import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Ticket } from 'lucide-react';
import ticketImg1 from '../../assets/ticket1.webp';
import ticketImg2 from '../../assets/ticket2.webp';
import loginBg from '../../assets/LoginBG.png';

export const SuccessPage = () => {
  const location = useLocation();
  const { clientName, ticketType, quantity } = location.state || { 
    clientName: 'ASISTENTE', 
    ticketType: 'ENTRADA GENERAL',
    quantity: 1 
  };

  const purchaseId = Math.random().toString(36).substring(2, 15).toUpperCase();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ATLANTIS-${purchaseId}&color=161821&bgcolor=E6E9F0`;

  return (
    <div className="min-h-screen bg-atlantis-white text-atlantis-bg-main font-plex relative overflow-hidden pt-16 pb-24">
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-16 md:-right-40 w-[21rem] md:w-[33.6rem] h-auto opacity-20 pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg2} alt="" className="w-full h-full object-cover grayscale" />
      </div>
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none z-0">
        <img src={loginBg} alt="" className="w-full h-full object-cover grayscale" />
      </div>
      <div className="absolute bottom-1/4 -left-16 md:-left-40 w-[21rem] md:w-[33.6rem] h-auto opacity-20 pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg1} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="container mx-auto max-w-6xl px-8 relative z-10">
        {/* Back Button matching other pages */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 font-plex font-bold uppercase tracking-widest text-atlantis-secondary hover:text-atlantis-primary transition-colors mb-12"
        >
          <span>←</span> Volver al inicio
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-atlantis-white border-2 border-atlantis-bg-main p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-10 border-b border-atlantis-bg-main/10 mb-10">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <CheckCircle size={32} />
                <h1 className="font-syne font-black text-4xl md:text-6xl uppercase tracking-tighter leading-none">
                  COMPRA CONFIRMADA
                </h1>
              </div>
              <p className="font-plex font-bold uppercase tracking-[0.2em] text-atlantis-bg-main/40 text-[10px]">
                BIENVENIDO AL ATLANTISFEST, {clientName}
              </p>
            </div>
            <div className="shrink-0 bg-atlantis-white p-2 border-2 border-atlantis-bg-main w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
              <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-10">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-40 mb-3 font-black">LOCALIZADOR</p>
                <p className="font-syne font-black text-3xl md:text-4xl tracking-tighter break-all leading-none">{purchaseId}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-3 opacity-40">
                  <Ticket size={16} />
                  <p className="text-[10px] font-black uppercase tracking-widest">RESUMEN DE ENTRADA</p>
                </div>
                <p className="font-syne font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none">{ticketType}</p>
                <p className="text-xs uppercase tracking-widest opacity-40 mt-2">CANTIDAD: {quantity}</p>
              </div>
            </div>

            <div className="flex flex-col justify-between pt-4 md:pt-0">
              <p className="font-plex text-xs leading-relaxed text-atlantis-bg-main/60 mb-10 uppercase tracking-widest font-bold">
                MUESTRA ESTE QR EN LA ENTRADA. HEMOS ENVIADO EL TICKET A TU CORREO. PREPÁRATE PARA EL ATLANTIS.
              </p>
              
              <button className="w-full bg-atlantis-bg-main text-atlantis-white px-8 py-5 font-syne font-black text-sm uppercase tracking-tighter hover:bg-atlantis-primary hover:text-atlantis-white transition-all">
                DESCARGAR ENTRADAS PDF
              </button>

              <Link 
                to="/cliente"
                className="w-full border-2 border-atlantis-bg-main text-atlantis-bg-main px-8 py-4 font-syne font-black text-sm uppercase tracking-tighter hover:bg-atlantis-bg-main hover:text-atlantis-white transition-all text-center mt-4"
              >
                IR A MI ÁREA PERSONAL
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
