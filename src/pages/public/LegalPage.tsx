import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const LegalPage = () => {
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
          className="font-syne font-bold text-5xl md:text-7xl uppercase tracking-tighter mb-16 text-atlantis-bg-main"
        >
          Aviso Legal
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-12 text-sm md:text-base leading-relaxed text-atlantis-bg-alt/80"
        >
          <section>
            <h2 className="font-plex font-bold uppercase tracking-widest text-atlantis-primary mb-4 text-xl">1. Términos y Condiciones</h2>
            <p className="mb-4">
              Bienvenido a AtlantisFest. Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones de uso, todas las leyes y regulaciones aplicables. El material contenido en este sitio web está protegido por las leyes de derechos de autor y marcas aplicables.
            </p>
            <p>
              La compra de entradas a través de nuestra plataforma implica la aceptación incondicional de las normativas del recinto y las políticas de reembolso establecidas por la organización.
            </p>
          </section>

          <section>
            <h2 className="font-plex font-bold uppercase tracking-widest text-atlantis-primary mb-4 text-xl">2. Política de Privacidad</h2>
            <p className="mb-4">
              Tu privacidad es importante para nosotros. Es política de AtlantisFest respetar tu privacidad con respecto a cualquier información que podamos recopilar a través de nuestro sitio web y otros sitios que poseemos y operamos.
            </p>
            <p>
              Solo solicitamos información personal cuando realmente la necesitamos para proporcionarte un servicio (como la venta de tickets). La recopilamos por medios justos y lícitos, con tu conocimiento y consentimiento.
            </p>
          </section>

          <section>
            <h2 className="font-plex font-bold uppercase tracking-widest text-atlantis-primary mb-4 text-xl">3. Política de Cookies</h2>
            <p>
              Utilizamos cookies para personalizar el contenido y los anuncios, ofrecer funciones de redes sociales y analizar el tráfico. También compartimos información sobre tu uso de nuestro sitio con nuestros socios de redes sociales, publicidad y análisis, quienes pueden combinarla con otra información que les hayas proporcionado.
            </p>
          </section>

          <section>
            <h2 className="font-plex font-bold uppercase tracking-widest text-atlantis-primary mb-4 text-xl">4. Derecho de Admisión</h2>
            <p>
              La organización se reserva el derecho de admisión bajo las condiciones establecidas por la legislación vigente. El acceso al recinto requiere presentar una entrada válida y puede estar sujeto a controles de seguridad.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};
