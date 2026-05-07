import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { foodtruckService } from '../../services/foodtruck.service';
import { zoneService } from '../../services/zone.service';
import api from '../../config/api';
import { useAuthStore } from '../../store/authStore';
import { Utensils, MapPin, CheckCircle, FileText, UploadCloud, Store } from 'lucide-react';
import type { FoodtruckOutputDTO } from '../../types/output.dto';
import type { FoodtruckInputDTO } from '../../types/input.dto';
import ticketImg1 from '../../assets/ticket1.webp';
import ticketImg2 from '../../assets/ticket2.webp';

export const FoodtruckPersonalPage = () => {
  const [foodtruck, setFoodtruck] = useState<FoodtruckOutputDTO | null>(null);
  const [zoneId, setZoneId] = useState<number | null>(null);
  const [menuPdfUrl, setMenuPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingMenu, setUploadingMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user: authUser } = useAuthStore();
  const truckUsername = authUser?.name || 'FOODTRUCK';

  useEffect(() => {
    fetchFoodtruck();
  }, []);

  const fetchMenuPdf = async (id: number) => {
    try {
      const res = await api.get(`/foodtrucks/${id}/menu`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const localUrl = URL.createObjectURL(blob);
      setMenuPdfUrl(localUrl);
    } catch (err) {
      console.error("Error loading PDF menu blob:", err);
      setMenuPdfUrl(null);
    }
  };

  const fetchFoodtruck = async () => {
    if (!authUser?.name) {
      setLoading(false);
      return;
    }
    try {
      const res = await foodtruckService.getAll(0, 100);
      const myTruck = res.content.find((f: FoodtruckOutputDTO) => f.username === authUser.name);
      if (myTruck) {
        setFoodtruck(myTruck);
        
        // Fetch zones to resolve the matching zoneId
        try {
          const zonesRes = await zoneService.getAll(0, 100);
          const matchedZone = zonesRes.content.find(z => z.nombre === myTruck.zoneNombre);
          if (matchedZone) {
            setZoneId(matchedZone.id);
          }
        } catch (zoneErr) {
          console.error("Error fetching zones:", zoneErr);
        }

        // Fetch PDF menu blob to bypass local frame restrictions
        if (myTruck.tieneMenuPdf) {
          fetchMenuPdf(myTruck.id);
        }
      }
    } catch (err) {
      console.error("Error fetching foodtruck:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOpen = async () => {
    if (!foodtruck) return;
    setUpdating(true);
    try {
      const inputDto: FoodtruckInputDTO = {
        email: foodtruck.email,
        username: foodtruck.username,
        nombre: foodtruck.nombre,
        tipoComida: foodtruck.tipoComida,
        estaAbierto: !foodtruck.estaAbierto,
        zoneId: zoneId || undefined, // Maintain the untouched zone mapping
        tieneMenuPdf: foodtruck.tieneMenuPdf
      };
      const updated = await foodtruckService.update(foodtruck.id, inputDto);
      setFoodtruck(updated);
    } catch (err) {
      console.error("Error updating status:", err);
      await fetchFoodtruck();
    } finally {
      setUpdating(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !foodtruck) return;
    const file = e.target.files[0];
    setUploadingMenu(true);
    try {
      await foodtruckService.uploadMenuPdf(foodtruck.id, file);
      await fetchFoodtruck();
      await fetchMenuPdf(foodtruck.id);
    } catch (err) {
      console.error("Error uploading menu:", err);
    } finally {
      setUploadingMenu(false);
    }
  };

  return (
    <div className="min-h-screen bg-atlantis-white text-atlantis-bg-main font-plex relative overflow-hidden pt-32 pb-24">
      
      {/* Ambient Decor */}
      <div className="absolute top-1/4 -right-32 md:-right-60 w-[21rem] md:w-[33.6rem] h-auto opacity-[0.08] pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg2} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="absolute bottom-0 -left-32 md:-left-60 w-[21rem] md:w-[33.6rem] h-auto opacity-[0.08] pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg1} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="container mx-auto max-w-6xl px-8 relative z-10">
        {/* Header */}
        <div className="mb-24 border-b border-atlantis-bg-main/10 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-atlantis-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">ÁREA DEL FOODTRUCK</span>
          </div>
          <h1 className="font-syne font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-6">
            {foodtruck?.nombre || `HOLA, ${truckUsername}`}<span className="text-atlantis-primary">.</span>
          </h1>
          <p className="font-plex text-sm md:text-base uppercase tracking-widest text-atlantis-bg-main/40 max-w-2xl leading-relaxed">
            Bienvenido a tu panel de control. Gestiona tu estado operativo y mantén tu menú actualizado para los asistentes.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-[10px] uppercase tracking-widest opacity-40 animate-pulse">
            Sincronizando sistema...
          </div>
        ) : foodtruck ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Left Column: Info & Status */}
            <div className="lg:col-span-4 space-y-12">
              <section>
                <div className="flex items-center justify-between mb-10 border-b border-atlantis-bg-main pb-4">
                  <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter flex items-center gap-4">
                    <Store size={20} className="text-atlantis-primary" />
                    INFORMACIÓN
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div className="border border-atlantis-bg-main/10 p-6 relative overflow-hidden bg-white/50 backdrop-blur-sm">
                    <div className="relative z-10 space-y-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1 font-bold">Especialidad</p>
                        <p className="font-syne font-bold text-lg flex items-center gap-2">
                          <Utensils size={16} className="text-atlantis-primary" />
                          {foodtruck.tipoComida || 'General'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1 font-bold">Zona Asignada</p>
                        <p className="font-plex font-bold text-sm flex items-center gap-2">
                          <MapPin size={16} className="opacity-60" />
                          {foodtruck.zoneNombre || 'Pendiente de asignación'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-10 border-b border-atlantis-bg-main pb-4">
                  <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter flex items-center gap-4">
                    <CheckCircle size={20} className="text-atlantis-primary" />
                    ESTADO
                  </h2>
                </div>

                <div className={`border p-6 transition-colors ${foodtruck.estaAbierto ? 'border-atlantis-primary bg-atlantis-primary/10' : 'border-atlantis-bg-main/10 bg-white/50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-syne font-bold text-lg uppercase tracking-tighter">
                        {foodtruck.estaAbierto ? 'ABIERTO' : 'CERRADO'}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest opacity-60 mt-1">
                        {foodtruck.estaAbierto ? 'Visible para los clientes' : 'Oculto en el mapa'}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleToggleOpen}
                      disabled={updating}
                      className={`relative w-16 h-8 rounded-full transition-colors ${foodtruck.estaAbierto ? 'bg-atlantis-primary' : 'bg-atlantis-bg-main/20'} ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <motion.div 
                        className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                        animate={{ left: foodtruck.estaAbierto ? '36px' : '4px' }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Menu PDF */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-10 border-b border-atlantis-bg-main pb-4">
                <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter flex items-center gap-4">
                  <FileText size={20} className="text-atlantis-primary" />
                  CARTA / MENÚ
                </h2>
                
                <div>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingMenu}
                    className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest bg-atlantis-bg-main text-atlantis-white px-4 py-2 hover:bg-atlantis-primary transition-colors disabled:opacity-50"
                  >
                    <UploadCloud size={14} />
                    {uploadingMenu ? 'SUBIENDO...' : 'CAMBIAR PDF'}
                  </button>
                </div>
              </div>

              <div className="w-full h-[600px] border border-atlantis-bg-main/10 bg-white/50 backdrop-blur-sm relative flex items-center justify-center overflow-hidden">
                {menuPdfUrl ? (
                  <iframe 
                    src={menuPdfUrl} 
                    className="w-full h-full border-none"
                    title="Menu PDF"
                  />
                ) : (
                  <div className="text-center opacity-40">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-plex font-bold text-sm uppercase tracking-widest">
                      NO HAY MENÚ SUBIDO O NO SE PUDO CARGAR
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-atlantis-bg-main/20 p-12 text-center">
            <p className="font-plex font-bold text-sm uppercase tracking-widest text-atlantis-bg-main/40">
              NO SE ENCONTRÓ INFORMACIÓN DE ESTE FOODTRUCK
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
