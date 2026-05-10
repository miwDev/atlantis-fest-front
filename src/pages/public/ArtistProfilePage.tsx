import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { artistService } from '../../services/artist.service';
import { socialMediaService } from '../../services/social-media.service';
import type { ArtistOutputDTO, SocialMediaOutputDTO } from '../../types/output.dto';
import { User, Save, Plus, Trash2, Globe, Image as ImageIcon, Check, Music } from 'lucide-react';
import defaultArtist from '../../assets/defaultArtist.png';
import { genreService } from '../../services/genre.service';
import type { GenreOutputDTO } from '../../types/output.dto';

export const ArtistProfilePage = () => {
  const { user } = useAuthStore();
  const [artist, setArtist] = useState<ArtistOutputDTO | null>(null);
  const [socials, setSocials] = useState<SocialMediaOutputDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    artistName: '',
    biography: '',
    email: '',
    genreIds: [] as number[],
  });

  const [allGenres, setAllGenres] = useState<GenreOutputDTO[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | string>('');

  // Social media form state
  const [newSocial, setNewSocial] = useState({ tipo: 'SPOTIFY', url: '' });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const data = await artistService.getById(user.id);
      setArtist(data);
      setFormData(prev => ({
        ...prev,
        name: data.name || '',
        surname: data.surname || '',
        artistName: data.artistName || '',
        biography: data.biography || '',
        email: data.email || '',
      }));

      // Fetch all available genres
      const allGenRes = await genreService.getAll(0, 100);
      setAllGenres(allGenRes.content);

      // Fetch social media (assuming we filter by current artist)
      const socRes = await socialMediaService.getAll(0, 100);
      setSocials(socRes.content.filter(s => s.artistName === data.artistName));

      // Map current genre names to IDs (this is a workaround if ArtistOutputDTO doesn't have IDs)
      // If the backend doesn't provide them, we find them in allGenres by name
      const currentGenreIds = allGenRes.content
        .filter(g => data.genres?.includes(g.nombre))
        .map(g => g.id);
      
      setFormData(prev => ({ ...prev, genreIds: currentGenreIds }));
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artist) return;
    setSaving(true);
    try {
      await artistService.update(artist.id, {
        ...formData,
        username: artist.username,
      });
      setSuccessMsg('Perfil actualizado correctamente');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Error updating profile", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSocial = async () => {
    if (!artist || !newSocial.url) return;
    try {
      await socialMediaService.create({
        ...newSocial,
        artistId: artist.id
      });
      setNewSocial({ tipo: 'SPOTIFY', url: '' });
      fetchProfile(); // Refresh
    } catch (err) {
      console.error("Error adding social media", err);
    }
  };

  const handleDeleteSocial = async (id: number) => {
    try {
      await socialMediaService.delete(id);
      fetchProfile(); // Refresh
    } catch (err) {
      console.error("Error deleting social media", err);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !artist) return;
    try {
      await artistService.uploadFoto(artist.id, file);
      
      // FIX: Al subir la foto, el backend parece perder los géneros (posible bug de Lazy Fetching).
      // Re-guardamos el perfil inmediatamente con los datos actuales para forzar que se mantengan los géneros.
      await artistService.update(artist.id, {
        ...formData,
        username: artist.username,
      });
      
      fetchProfile();
    } catch (err) {
      console.error("Error uploading photo", err);
    }
  };

  const handleAddGenre = async () => {
    if (!selectedGenreId || !artist) return;
    const gId = Number(selectedGenreId);
    if (formData.genreIds.includes(gId)) return;

    const newGenreIds = [...formData.genreIds, gId];
    setFormData({ ...formData, genreIds: newGenreIds });
    setSelectedGenreId('');
    
    // Auto-save genres on change or wait for manual save? 
    // User expects it like social media (immediate or separate section).
    // But genres are part of ArtistInputDTO, so they are saved with handleUpdateProfile.
    // To make it consistent with social media, we can call update immediately.
    try {
      await artistService.update(artist.id, {
        ...formData,
        genreIds: newGenreIds,
        username: artist.username
      });
      setSuccessMsg('Género añadido');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      console.error("Error adding genre", err);
    }
  };

  const handleDeleteGenre = async (gId: number) => {
    if (!artist) return;
    const newGenreIds = formData.genreIds.filter(id => id !== gId);
    setFormData({ ...formData, genreIds: newGenreIds });
    
    try {
      await artistService.update(artist.id, {
        ...formData,
        genreIds: newGenreIds,
        username: artist.username
      });
      setSuccessMsg('Género eliminado');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      console.error("Error deleting genre", err);
    }
  };

  if (loading) return <div className="min-h-screen bg-atlantis-white pt-32 text-center font-plex uppercase tracking-widest opacity-40">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-atlantis-white text-atlantis-bg-main font-plex relative pt-32 pb-24 overflow-hidden">
      
      {/* Background Decor Resources - Adjusted for better readability */}
      <div className="absolute top-1/4 -right-32 md:-right-60 w-[21rem] md:w-[33.6rem] h-auto opacity-[0.08] pointer-events-none mix-blend-multiply z-0">
        <img src="/src/assets/ticket2.webp" alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="absolute bottom-0 -left-32 md:-left-60 w-[21rem] md:w-[33.6rem] h-auto opacity-[0.08] pointer-events-none mix-blend-multiply z-0">
        <img src="/src/assets/ticket1.webp" alt="" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="container mx-auto max-w-6xl px-8 relative z-10">
        {/* Header - Premium Minimalist */}
        <div className="mb-24 border-b border-atlantis-bg-main/10 pb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-atlantis-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">CONFIGURACIÓN DE PERFIL ARTÍSTICO</span>
          </div>
          <h1 className="font-syne font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-6">
            MI PERFIL<span className="text-atlantis-primary">.</span>
          </h1>
          <p className="font-plex text-sm md:text-base uppercase tracking-widest text-atlantis-bg-main/40 max-w-2xl leading-relaxed">
            Gestiona tu presencia en AtlantisFest. La información aquí guardada se reflejará en la landing page y en la app oficial del festival.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Form Column */}
          <div className="lg:col-span-8 space-y-24">
            <form onSubmit={handleUpdateProfile} className="space-y-16">
              <section>
                <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter mb-12 border-b border-atlantis-bg-main pb-4">
                  INFORMACIÓN PÚBLICA
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic">NOMBRE ARTÍSTICO</label>
                    <input 
                      type="text"
                      value={formData.artistName}
                      onChange={e => setFormData({...formData, artistName: e.target.value})}
                      className="w-full border-b border-atlantis-bg-main/10 bg-transparent py-4 font-syne font-bold text-xl uppercase focus:border-atlantis-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic">EMAIL DE CONTACTO</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border-b border-atlantis-bg-main/10 bg-transparent py-4 font-syne font-bold text-xl uppercase focus:border-atlantis-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic">NOMBRE REAL</label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border-b border-atlantis-bg-main/10 bg-transparent py-4 font-syne font-bold text-xl uppercase focus:border-atlantis-primary outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic">APELLIDOS</label>
                    <input 
                      type="text"
                      value={formData.surname}
                      onChange={e => setFormData({...formData, surname: e.target.value})}
                      className="w-full border-b border-atlantis-bg-main/10 bg-transparent py-4 font-syne font-bold text-xl uppercase focus:border-atlantis-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 italic">BIOGRAFÍA DEL ARTISTA</label>
                  <textarea 
                    rows={6}
                    value={formData.biography}
                    onChange={e => setFormData({...formData, biography: e.target.value})}
                    className="w-full border border-atlantis-bg-main/10 bg-transparent p-6 font-plex text-sm focus:border-atlantis-primary outline-none transition-all resize-none leading-relaxed"
                  />
                </div>
              </section>

              <div className="flex items-center gap-8">
                <button 
                  type="submit"
                  disabled={saving}
                  className="bg-atlantis-bg-main text-atlantis-white px-12 py-5 font-syne font-black text-sm uppercase tracking-widest hover:bg-atlantis-primary transition-all flex items-center gap-4"
                >
                  <Save size={18} />
                  {saving ? 'PROCESANDO...' : 'ACTUALIZAR PERFIL'}
                </button>
                {successMsg && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-atlantis-primary font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-3"
                  >
                    <Check size={16} />
                    {successMsg}
                  </motion.div>
                )}
              </div>
            </form>

            {/* Social Media Section */}
            <section className="pt-24 border-t border-atlantis-bg-main/10">
              <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter mb-12 border-b border-atlantis-bg-main pb-4">
                PRESENCIA DIGITAL
              </h2>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-3">
                    <select 
                      value={newSocial.tipo}
                      onChange={e => setNewSocial({...newSocial, tipo: e.target.value})}
                      className="w-full border-b border-atlantis-bg-main/10 py-4 font-syne font-bold text-sm outline-none appearance-none bg-transparent cursor-pointer hover:border-atlantis-primary transition-all"
                    >
                      <option value="SPOTIFY">SPOTIFY</option>
                      <option value="INSTAGRAM">INSTAGRAM</option>
                      <option value="YOUTUBE">YOUTUBE</option>
                      <option value="TIKTOK">TIKTOK</option>
                      <option value="TWITTER">TWITTER</option>
                      <option value="WEB">WEBSITE</option>
                    </select>
                  </div>
                  <div className="md:col-span-7">
                    <input 
                      type="url"
                      placeholder="HTTPS://URL-DE-TU-RED.COM"
                      value={newSocial.url}
                      onChange={e => setNewSocial({...newSocial, url: e.target.value})}
                      className="w-full border-b border-atlantis-bg-main/10 py-4 font-plex text-sm uppercase focus:border-atlantis-primary outline-none transition-all placeholder:opacity-20"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button 
                      onClick={handleAddSocial}
                      className="w-full bg-atlantis-bg-main text-atlantis-white py-4 hover:bg-atlantis-primary transition-all flex items-center justify-center gap-3 font-syne font-black text-[9px] uppercase tracking-widest"
                    >
                      <Plus size={14} />
                      AÑADIR
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socials.map(s => (
                    <motion.div 
                      key={s.id} 
                      whileHover={{ x: 5 }}
                      className="border-b border-atlantis-bg-main/10 py-6 flex justify-between items-center group"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-[9px] font-black uppercase tracking-widest text-atlantis-primary bg-atlantis-primary/5 px-2 py-0.5">{s.tipo}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[180px] opacity-30">{s.url}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteSocial(s.id)}
                        className="text-atlantis-bg-main/20 hover:text-atlantis-error transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Genres Section */}
            <section className="pt-24 border-t border-atlantis-bg-main/10">
              <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter mb-12 border-b border-atlantis-bg-main pb-4">
                GÉNEROS MUSICALES
              </h2>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-10">
                    <select 
                      value={selectedGenreId}
                      onChange={e => setSelectedGenreId(e.target.value)}
                      className="w-full border-b border-atlantis-bg-main/10 py-4 font-syne font-bold text-sm outline-none appearance-none bg-transparent cursor-pointer hover:border-atlantis-primary transition-all"
                    >
                      <option value="">SELECCIONA UN GÉNERO</option>
                      {allGenres.filter(g => !formData.genreIds.includes(g.id)).map(g => (
                        <option key={g.id} value={g.id}>{g.nombre.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <button 
                      onClick={handleAddGenre}
                      className="w-full bg-atlantis-bg-main text-atlantis-white py-4 hover:bg-atlantis-primary transition-all flex items-center justify-center gap-3 font-syne font-black text-[9px] uppercase tracking-widest"
                    >
                      <Plus size={14} />
                      AÑADIR
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  {formData.genreIds.map(gId => {
                    const genre = allGenres.find(g => g.id === gId);
                    return (
                      <motion.div 
                        key={gId} 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-4 bg-atlantis-bg-main text-atlantis-white px-4 py-2 group"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">{genre?.nombre}</span>
                        <button 
                          onClick={() => handleDeleteGenre(gId)}
                          className="hover:text-atlantis-error transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    );
                  })}
                  {formData.genreIds.length === 0 && (
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20 italic">[ NO HAY GÉNEROS ASIGNADOS ]</p>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Photo Column */}
          <div className="lg:col-span-4 space-y-12">
            <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter border-b border-atlantis-bg-main pb-4">
              IMAGE_ASSET
            </h2>
            <div className="relative group overflow-hidden">
              <div className="aspect-[3/4] bg-atlantis-bg-alt/10 border border-atlantis-bg-main/5">
                <img 
                  src={artist?.fotoUrl || defaultArtist} 
                  alt="Profile" 
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
              </div>
              <label className="absolute inset-0 bg-atlantis-bg-main/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 backdrop-blur-sm">
                <ImageIcon size={32} className="text-atlantis-white mb-4" />
                <span className="text-atlantis-white font-syne font-black text-xs uppercase tracking-widest">SUBIR NUEVA FOTO</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
            <div className="p-6 border border-atlantis-bg-main/5 bg-atlantis-bg-main/[0.02]">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 leading-relaxed text-center">
                * RECOMENDADO: FORMATO VERTICAL (9:16) <br/> MIN 1080PX PARA CALIDAD HD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
