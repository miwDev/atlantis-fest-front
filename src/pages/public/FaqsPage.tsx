import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "¿Dónde se celebra AtlantisFest?",
    answer: "AtlantisFest tiene lugar en el recinto ferial principal de la ciudad, un espacio de más de 50.000 metros cuadrados perfectamente comunicado y acondicionado para albergar todas las zonas del festival."
  },
  {
    question: "¿A qué hora abren las puertas?",
    answer: "Las puertas se abren a las 16:00 horas todos los días del festival. Te recomendamos llegar con tiempo para evitar colas y poder disfrutar de todo el recinto desde primera hora."
  },
  {
    question: "¿Se puede entrar con comida o bebida?",
    answer: "No está permitida la entrada con comida ni bebida del exterior, salvo una botella de agua pequeña (sin tapón) por motivos de seguridad. Dentro del recinto disponemos de una amplia zona de Foodtrucks con opciones para todos los gustos."
  },
  {
    question: "¿Qué pasa si pierdo mi pulsera?",
    answer: "La pulsera es personal e intransferible. En caso de pérdida o rotura, deberás acudir a la caseta de incidencias situada en el acceso principal junto con tu entrada original y DNI. El cambio de pulsera por rotura tiene un coste de gestión."
  },
  {
    question: "¿Hay edad mínima para asistir?",
    answer: "Los menores de 16 años deberán ir acompañados de madre, padre o tutor legal. Los jóvenes de 16 y 17 años pueden entrar solos, pero deberán presentar una autorización firmada que pueden descargar desde nuestro apartado Legal."
  }
];

export const FaqsPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-atlantis-white text-atlantis-bg-main min-h-screen pt-32 pb-24 font-plex selection:bg-atlantis-primary selection:text-atlantis-bg-main">
      <div className="container mx-auto max-w-4xl px-8 md:px-16 relative">
        <Link 
          to="/" 
          className="absolute -top-16 left-8 md:left-16 font-plex font-bold uppercase tracking-widest text-atlantis-secondary hover:text-atlantis-primary transition-colors flex items-center gap-2"
        >
          <span>←</span> Volver
        </Link>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-syne font-bold text-5xl md:text-7xl uppercase tracking-tighter mb-4 text-atlantis-bg-main"
        >
          Info & FAQs
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-plex text-atlantis-secondary uppercase tracking-widest text-sm mb-16"
        >
          Resuelve todas tus dudas antes de sumergirte
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-atlantis-secondary/20 overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left bg-atlantis-white hover:bg-atlantis-bg-main hover:text-atlantis-white transition-colors group"
              >
                <span className="font-plex font-bold uppercase tracking-wider text-sm md:text-base">
                  {faq.question}
                </span>
                <span className="text-xl font-syne text-atlantis-primary group-hover:text-atlantis-primary ml-4">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 border-t border-atlantis-secondary/20' : 'max-h-0'}`}
              >
                <div className="px-6 py-5 bg-atlantis-bg-alt/5 text-atlantis-bg-main/80 leading-relaxed text-sm">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
