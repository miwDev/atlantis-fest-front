import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

export const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 container mx-auto max-w-7xl px-8 md:px-24 py-12"
    >
      <header className="border-b border-atlantis-secondary/20 pb-6">
        <span className="font-plex text-[10px] text-atlantis-secondary uppercase tracking-[0.3em] font-black">
          Estado_Global // Protocolo_Activo
        </span>
        <h1 className="font-syne text-h2 font-bold text-atlantis-bg-main mt-2 uppercase tracking-tighter">
          Panel de Control
        </h1>
        <p className="font-plex text-xs font-bold text-atlantis-primary mt-2 uppercase tracking-widest">
          ACCESO AUTORIZADO: {user?.name || 'ADMINISTRADOR'}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { id: '01', label: 'Ventas Totales', value: '8.420', color: 'text-atlantis-bg-main' },
          { id: '02', label: 'Incidencias', value: '0', color: 'text-atlantis-primary' },
          { id: '03', label: 'Estado Red', value: '100%', color: 'text-atlantis-secondary' },
        ].map((stat) => (
          <div 
            key={stat.id} 
            className="border border-atlantis-secondary/20 p-8 flex flex-col justify-between h-48 hover:border-atlantis-bg-main transition-colors duration-300 relative group bg-atlantis-white"
          >
            <div className="flex justify-between items-start">
              <span className="font-plex text-[10px] font-black text-atlantis-secondary uppercase tracking-widest">
                {stat.label}
              </span>
              <span className="font-syne text-[10px] font-bold text-atlantis-secondary/50">
                {stat.id}
              </span>
            </div>
            <span className={`font-syne text-h3 font-extrabold ${stat.color} tracking-tighter group-hover:scale-105 transition-transform origin-left`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-atlantis-secondary/20 p-8 bg-atlantis-white">
          <h3 className="font-syne text-h5 font-bold text-atlantis-bg-main uppercase tracking-tight mb-6">
            Actividad Reciente
          </h3>
          <ul className="space-y-4">
            {[
              { time: '10:42', action: 'Nuevo usuario registrado [ID: 9482]' },
              { time: '09:15', action: 'Actualización de permisos STAFF' },
              { time: '08:00', action: 'Reinicio programado del servidor' }
            ].map((log, i) => (
              <li key={i} className="flex gap-4 font-plex text-xs border-b border-atlantis-secondary/10 pb-4 last:border-0 last:pb-0">
                <span className="font-bold text-atlantis-primary w-12">{log.time}</span>
                <span className="text-atlantis-secondary uppercase tracking-wider">{log.action}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-atlantis-secondary/20 p-8 bg-atlantis-bg-alt text-atlantis-white flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 border-2 border-atlantis-primary rounded-full flex items-center justify-center mb-6">
            <div className="w-2 h-2 bg-atlantis-primary rounded-full animate-pulse" />
          </div>
          <h3 className="font-syne text-h5 font-bold uppercase tracking-tight mb-2">
            Sincronización Activa
          </h3>
          <p className="font-plex text-[10px] text-atlantis-secondary uppercase tracking-[0.2em]">
            Conectado a la base de datos principal
          </p>
        </div>
      </div>
    </motion.div>
  );
};