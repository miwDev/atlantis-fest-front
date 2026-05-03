import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { ticketTypeService } from '../../services/ticket-type.service';
import { clientService } from '../../services/client.service';
import { purchaseService } from '../../services/purchase.service';
import ticketImg1 from '../../assets/ticket1.webp';
import ticketImg2 from '../../assets/ticket2.webp';
import type { TicketTypeOutputDTO } from '../../types/output.dto';
import type { ClientInputDTO, PurchaseInputDTO } from '../../types/input.dto';
import { CreditCard, Lock, ShieldCheck, X } from 'lucide-react';

export const CheckoutPage = () => {
  const { ticketTypeId } = useParams();
  const navigate = useNavigate();
  const [ticketType, setTicketType] = useState<TicketTypeOutputDTO | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [clientForm, setClientForm] = useState<ClientInputDTO>({
    email: '',
    username: '',
    password: '',
    nombre: '',
    apellidos: '',
    dni: '',
    fechaNacimiento: '',
    favoriteGenreIds: []
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({ card: '', expiry: '', cvv: '' });

  useEffect(() => {
    if (ticketTypeId) {
      ticketTypeService.getById(ticketTypeId)
        .then(setTicketType)
        .catch(() => setError('No se pudo cargar la información de la entrada.'))
        .finally(() => setLoading(false));
    }
  }, [ticketTypeId]);

  const handleApplyDiscount = () => {
    if (discountCode === 'DESCUENTO_10' && ticketType) {
      const discount = (ticketType.precioBase * quantity) * 0.1;
      setDiscountApplied(discount);
    } else {
      setDiscountApplied(0);
    }
  };

  const totalPrice = ticketType ? (ticketType.precioBase * quantity) - discountApplied : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar antes de abrir pasarela
    const hasErrors = Object.keys(clientForm).some(key => getErrorMessage(key, (clientForm as any)[key]));
    if (hasErrors) {
      setError('Por favor, corrige los errores en el formulario antes de continuar.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async () => {
    setProcessing(true);
    setShowPaymentModal(false);
    setError(null);

    try {
      // 1. Create client
      const newClient = await clientService.create(clientForm);
      
      // 2. Create purchases (one per quantity)
      const purchasePromises = [];
      const discountPerTicket = discountApplied / quantity;

      for (let i = 0; i < quantity; i++) {
        const purchaseData: PurchaseInputDTO = {
          clientId: newClient.id,
          ticketTypeId: Number(ticketTypeId),
          descuentoAplicado: discountPerTicket
        };
        purchasePromises.push(purchaseService.create(purchaseData));
      }

      await Promise.all(purchasePromises);
      
      // Save session info for personal area
      localStorage.setItem('atlantis_client_id', newClient.id.toString());
      localStorage.setItem('atlantis_client_name', clientForm.nombre);
      localStorage.setItem('atlantis_client_email', clientForm.email);
      
      // Redirect to success page with data
      navigate('/purchase-success', { 
        state: { 
          clientName: clientForm.nombre,
          ticketType: ticketType?.tipo,
          quantity: quantity
        } 
      });

    } catch (err: any) {
      setError('Ocurrió un error durante el proceso de compra. Por favor, inténtalo de nuevo.');
      setProcessing(false);
    }
  };

  const getErrorMessage = (name: string, value: string) => {
    if (!touched[name]) return '';
    if (!value) return 'Este campo es obligatorio';
    if (name === 'email') return !/^\S+@\S+\.\S+$/.test(value) ? 'Email no válido' : '';
    if (name === 'dni') return value.length < 9 ? 'DNI/Pasaporte no válido' : '';
    if (name === 'fechaNacimiento') {
      const birthDate = new Date(value);
      const today = new Date();
      if (birthDate >= today) return 'Debe ser una fecha pasada';
      
      const minAgeDate = new Date();
      minAgeDate.setFullYear(today.getFullYear() - 16);
      if (birthDate > minAgeDate) return 'Debes tener al menos 16 años';

      const maxAgeDate = new Date();
      maxAgeDate.setFullYear(today.getFullYear() - 99);
      if (birthDate < maxAgeDate) return 'Edad no válida';
    }
    return '';
  };

  const validateField = (name: string, value: string) => {
    return !!getErrorMessage(name, value);
  };

  if (loading) return <div className="min-h-screen bg-atlantis-white flex items-center justify-center font-plex uppercase tracking-widest text-atlantis-bg-main">Cargando detalles...</div>;

  if (success) {
    return (
      <div className="min-h-screen bg-atlantis-primary flex flex-col items-center justify-center p-8 text-atlantis-white">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <h1 className="font-syne font-black text-6xl md:text-8xl uppercase tracking-tighter mb-8 leading-none">¡ÉXITO!</h1>
          <p className="font-plex text-xl uppercase tracking-widest mb-12 border-b-2 border-atlantis-white pb-4 inline-block">Tu compra se ha procesado correctamente</p>
          <p className="font-plex text-sm opacity-80 max-w-md mx-auto">Te estamos redirigiendo a tu panel de cliente donde podrás ver tus entradas.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-atlantis-white text-atlantis-bg-main min-h-screen pt-24 pb-40 font-plex selection:bg-atlantis-primary relative overflow-hidden">
      
      {/* Background Decor Resources */}
      <div className="absolute -top-40 -right-40 md:-right-80 w-[50rem] md:w-[80rem] h-auto opacity-20 pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg1} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="absolute bottom-1/4 -left-20 md:-left-40 w-[25rem] md:w-[40rem] h-auto opacity-40 pointer-events-none mix-blend-multiply z-0">
        <img src={ticketImg2} alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="container mx-auto max-w-6xl px-8 md:px-16 relative z-10">
        <Link to="/tickets" className="inline-flex items-center gap-2 font-plex font-bold uppercase tracking-widest text-atlantis-secondary hover:text-atlantis-primary transition-colors mb-20">
          <span>←</span> Volver a selección
        </Link>

        <div className="flex flex-col gap-32 lg:gap-48 items-start">
          {/* Order Summary */}
          <div className="w-full max-w-4xl mx-auto order-1">
            <div className="border-4 border-atlantis-bg-main p-10 md:p-14 bg-atlantis-white relative">
              <h2 className="font-syne font-black text-4xl uppercase tracking-tighter mb-12 border-b-2 border-atlantis-bg-main pb-6">RESUMEN</h2>
              
              {ticketType && (
                <div className="space-y-10 mb-16">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-atlantis-secondary mb-2">TIPO DE ENTRADA</p>
                      <h3 className="font-syne font-bold text-3xl uppercase tracking-tighter">{ticketType.tipo}</h3>
                    </div>
                    <p className="font-bold text-2xl">{ticketType.precioBase}€</p>
                  </div>

                  <div className="flex justify-between items-center py-4 border-y border-atlantis-bg-main/10">
                    <p className="text-xs uppercase tracking-widest font-bold">CANTIDAD</p>
                    <div className="flex items-center border-2 border-atlantis-bg-main overflow-hidden scale-110">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-atlantis-primary transition-colors border-r-2 border-atlantis-bg-main">-</button>
                      <span className="px-6 py-2 font-bold">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="px-4 py-2 hover:bg-atlantis-primary transition-colors border-l-2 border-atlantis-bg-main">+</button>
                    </div>
                  </div>

                  <div className="pt-8">
                    <p className="text-[10px] uppercase tracking-widest text-atlantis-secondary mb-4">CÓDIGO DE DESCUENTO</p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="CÓDIGO"
                        className="flex-1 bg-transparent border-2 border-atlantis-bg-main px-6 py-4 font-plex uppercase text-xs focus:bg-atlantis-primary/10 outline-none"
                      />
                      <button onClick={handleApplyDiscount} className="bg-atlantis-bg-main text-atlantis-white px-6 py-4 text-xs font-bold uppercase hover:bg-atlantis-primary hover:text-atlantis-bg-main transition-colors">APLICAR</button>
                    </div>
                    {discountApplied > 0 && <p className="text-[10px] text-atlantis-primary font-bold mt-4 uppercase tracking-widest">✓ DESCUENTO 10% APLICADO: -{discountApplied.toFixed(2)}€</p>}
                  </div>
                </div>
              )}

              <div className="bg-atlantis-bg-main text-atlantis-white p-8 md:p-12 -mx-10 -mb-14 md:-mx-14 md:-mb-14 mt-16 flex justify-between items-center">
                <span className="font-syne font-black text-3xl uppercase tracking-tighter">TOTAL</span>
                <span className="font-syne font-black text-5xl tracking-tighter">{totalPrice.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          {/* Client Form (Se redujo mt y pt para menos separación) */}
          <div className="w-full max-w-4xl mx-auto order-2 mt-20 pt-16 border-t border-atlantis-bg-main/10">
            <h1 className="font-syne font-black text-5xl md:text-7xl uppercase tracking-tighter mb-4 leading-none text-left">DATOS PERSONALES</h1>
            <p className="font-plex text-sm uppercase tracking-widest text-atlantis-secondary mb-12 max-w-md leading-relaxed">Para finalizar la compra necesitamos crear tu perfil de asistente. Todos los campos son obligatorios.</p>

            {error && <div className="bg-atlantis-error/10 border-2 border-atlantis-error p-6 mb-12 text-atlantis-error font-plex font-bold uppercase text-xs tracking-widest">{error}</div>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-[0.3em] ${validateField('nombre', clientForm.nombre) ? 'text-atlantis-error' : 'text-atlantis-bg-main'}`}>NOMBRE</label>
                <input 
                  required 
                  type="text" 
                  value={clientForm.nombre} 
                  onChange={(e) => setClientForm({...clientForm, nombre: e.target.value})} 
                  onBlur={() => setTouched({...touched, nombre: true})}
                  className={`w-full bg-transparent border-b ${validateField('nombre', clientForm.nombre) ? 'border-atlantis-error' : 'border-atlantis-bg-main/20 focus:border-atlantis-primary'} outline-none py-4 font-syne font-bold text-xl uppercase placeholder:opacity-20 transition-colors`} 
                  placeholder="TU NOMBRE" 
                />
                <div className="h-6 overflow-hidden">
                  {validateField('nombre', clientForm.nombre) && <p className="text-[10px] text-atlantis-error font-bold uppercase tracking-widest pt-2">{getErrorMessage('nombre', clientForm.nombre)}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-[0.3em] ${validateField('apellidos', clientForm.apellidos) ? 'text-atlantis-error' : 'text-atlantis-bg-main'}`}>APELLIDOS</label>
                <input 
                  required 
                  type="text" 
                  value={clientForm.apellidos} 
                  onChange={(e) => setClientForm({...clientForm, apellidos: e.target.value})} 
                  onBlur={() => setTouched({...touched, apellidos: true})}
                  className={`w-full bg-transparent border-b ${validateField('apellidos', clientForm.apellidos) ? 'border-atlantis-error' : 'border-atlantis-bg-main/20 focus:border-atlantis-primary'} outline-none py-4 font-syne font-bold text-xl uppercase placeholder:opacity-20 transition-colors`} 
                  placeholder="TUS APELLIDOS" 
                />
                <div className="h-6 overflow-hidden">
                  {validateField('apellidos', clientForm.apellidos) && <p className="text-[10px] text-atlantis-error font-bold uppercase tracking-widest pt-2">{getErrorMessage('apellidos', clientForm.apellidos)}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-[0.3em] ${validateField('email', clientForm.email) ? 'text-atlantis-error' : 'text-atlantis-bg-main'}`}>EMAIL</label>
                <input 
                  required 
                  type="email" 
                  value={clientForm.email} 
                  onChange={(e) => setClientForm({...clientForm, email: e.target.value, username: e.target.value.split('@')[0]})} 
                  onBlur={() => setTouched({...touched, email: true})}
                  className={`w-full bg-transparent border-b ${validateField('email', clientForm.email) ? 'border-atlantis-error' : 'border-atlantis-bg-main/20 focus:border-atlantis-primary'} outline-none py-4 font-syne font-bold text-xl uppercase placeholder:opacity-20 transition-colors`} 
                  placeholder="EMAIL@EXAMPLE.COM" 
                />
                <div className="h-6 overflow-hidden">
                  {validateField('email', clientForm.email) && <p className="text-[10px] text-atlantis-error font-bold uppercase tracking-widest pt-2">{getErrorMessage('email', clientForm.email)}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-[0.3em] ${validateField('dni', clientForm.dni) ? 'text-atlantis-error' : 'text-atlantis-bg-main'}`}>DNI / PASAPORTE</label>
                <input 
                  required 
                  type="text" 
                  value={clientForm.dni} 
                  onChange={(e) => setClientForm({...clientForm, dni: e.target.value})} 
                  onBlur={() => setTouched({...touched, dni: true})}
                  className={`w-full bg-transparent border-b ${validateField('dni', clientForm.dni) ? 'border-atlantis-error' : 'border-atlantis-bg-main/20 focus:border-atlantis-primary'} outline-none py-4 font-syne font-bold text-xl uppercase placeholder:opacity-20 transition-colors`} 
                  placeholder="00000000X" 
                />
                <div className="h-6 overflow-hidden">
                  {validateField('dni', clientForm.dni) && <p className="text-[10px] text-atlantis-error font-bold uppercase tracking-widest pt-2">{getErrorMessage('dni', clientForm.dni)}</p>}
                </div>
              </div>
              
              {/* Ajustes en fecha: pr-16 añadido, y transform aplicado vía CSS */}
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-[0.3em] ${validateField('fechaNacimiento', clientForm.fechaNacimiento) ? 'text-atlantis-error' : 'text-atlantis-bg-main'}`}>FECHA DE NACIMIENTO</label>
                <div className={`flex items-center border-b ${validateField('fechaNacimiento', clientForm.fechaNacimiento) ? 'border-atlantis-error' : 'border-atlantis-bg-main/20 focus-within:border-atlantis-primary'} transition-colors`}>
                  <input 
                    required 
                    type="date" 
                    value={clientForm.fechaNacimiento} 
                    onChange={(e) => setClientForm({...clientForm, fechaNacimiento: e.target.value})} 
                    onBlur={() => setTouched({...touched, fechaNacimiento: true})}
                    className="w-full bg-transparent outline-none py-4 font-syne font-bold text-xl [color-scheme:light]" 
                  />
                  <style>{`
                    input[type="date"]::-webkit-calendar-picker-indicator {
                      display: none;
                      -webkit-appearance: none;
                    }
                  `}</style>
                </div>
                <div className="h-6 overflow-hidden">
                  {validateField('fechaNacimiento', clientForm.fechaNacimiento) && <p className="text-[10px] text-atlantis-error font-bold uppercase tracking-widest pt-2">{getErrorMessage('fechaNacimiento', clientForm.fechaNacimiento)}</p>}
                </div>
              </div>
              
              {/* Ajustes en password: pr-20 añadido y right-4 en el botón */}
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-[0.3em] ${validateField('password', clientForm.password) ? 'text-atlantis-error' : 'text-atlantis-bg-main'}`}>CONTRASEÑA</label>
                <div className={`flex items-center border-b ${validateField('password', clientForm.password) ? 'border-atlantis-error' : 'border-atlantis-bg-main/20 focus-within:border-atlantis-primary'} transition-colors`}>
                  <button
                    type="button"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    onTouchStart={() => setShowPassword(true)}
                    onTouchEnd={() => setShowPassword(false)}
                    className="p-2 text-atlantis-bg-main/30 hover:text-atlantis-primary transition-colors cursor-pointer select-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <input 
                    required 
                    type={showPassword ? 'text' : 'password'} 
                    value={clientForm.password} 
                    onChange={(e) => setClientForm({...clientForm, password: e.target.value})} 
                    onBlur={() => setTouched({...touched, password: true})}
                    className="w-full bg-transparent outline-none py-4 pl-4 font-syne font-bold text-xl placeholder:opacity-20" 
                    placeholder="••••••••" 
                  />
                </div>
                <div className="h-6 overflow-hidden">
                  {validateField('password', clientForm.password) && <p className="text-[10px] text-atlantis-error font-bold uppercase tracking-widest pt-2">{getErrorMessage('password', clientForm.password)}</p>}
                </div>
              </div>

              <div className="md:col-span-2 pt-12 max-w-md">
                <button 
                  disabled={processing}
                  type="submit" 
                  className={`w-full group relative overflow-hidden bg-atlantis-bg-main py-6 font-syne font-black text-xl uppercase tracking-tighter transition-all hover:bg-atlantis-primary ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={`relative z-10 text-atlantis-white group-hover:text-atlantis-bg-main transition-colors ${processing ? 'animate-pulse' : ''}`}>
                    {processing ? 'PROCESANDO...' : 'FINALIZAR Y PAGAR'}
                  </span>
                </button>
                <p className="mt-8 text-[10px] uppercase tracking-widest text-atlantis-secondary text-center opacity-60">Al hacer clic en pagar, aceptas los términos de uso y la política de privacidad de AtlantisFest.</p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Payment Modal Mock */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-atlantis-bg-main/60">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-atlantis-white border-2 border-atlantis-bg-main p-8 md:p-12 max-w-lg w-full shadow-[16px_16px_0px_0px_rgba(22,24,33,1)]"
          >
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="font-syne font-black text-4xl uppercase tracking-tighter leading-none mb-2">PAGO SEGURO</h2>
                <p className="font-plex text-[10px] uppercase tracking-widest opacity-60">PROCESANDO TRANSACCIÓN</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="hover:text-atlantis-error transition-colors">
                <X size={32} />
              </button>
            </div>

            <div className="space-y-10">
              <div className="border-2 border-atlantis-bg-main p-8 flex flex-col items-center gap-2 bg-atlantis-white">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-center">TOTAL A PAGAR</span>
                <span className="font-syne font-black text-6xl tracking-tighter text-atlantis-bg-main">{totalPrice.toFixed(2)}€</span>
              </div>

              <div className="flex items-center gap-4 py-4 border-y border-atlantis-bg-main/10">
                <ShieldCheck size={20} className="text-atlantis-bg-main/40" />
                <p className="text-[10px] uppercase font-black tracking-widest opacity-60">SISTEMA DE PAGO CIFRADO SSL</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleProcessPayment}
                  className="w-full bg-atlantis-bg-main text-atlantis-white py-6 font-syne font-black text-xl uppercase tracking-tighter hover:bg-atlantis-primary transition-all"
                >
                  CONFIRMAR COMPRA
                </button>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-2 font-plex font-bold text-[10px] uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity"
                >
                  VOLVER ATRÁS
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};