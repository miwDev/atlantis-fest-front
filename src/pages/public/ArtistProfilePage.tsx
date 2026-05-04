import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { artistService } from '../../services/artist.service';
import { socialMediaService } from '../../services/social-media.service';
import type { ArtistOutputDTO, SocialMediaOutputDTO } from '../../types/output.dto';
import { User, Save, Plus, Trash2, Globe, Image as ImageIcon, Check } from 'lucide-react';
import defaultArtist from '../../assets/defaultArtist.png';

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
  });

  // Social media form state
  const [newSocial, setNewSocial] = useState({ tipo: 'SPOTIFY', url: '' });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) return;
    try {
      const data = await artistService.getById(user.id);
      setArtist(data);
      setFormData({
        name: data.name || '',
        surname: data.surname || '',
        artistName: data.artistName || '',
        biography: data.biography || '',
        email: data.email || '',
      });

      // Fetch social media (assuming we filter by current artist)
      const socRes = await socialMediaService.getAll(0, 100);
      setSocials(socRes.content.filter(s => s.artistName === data.artistName));
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
      fetchProfile();
    } catch (err) {
      console.error("Error uploading photo", err);
    }
  };

  if (loading) return <div className="min-h-screen bg-atlantis-white pt-32 text-center font-plex uppercase tracking-widest opacity-40">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-atlantis-white text-atlantis-bg-main font-plex relative pt-32 pb-24">
      <div className="container mx-auto max-w-6xl px-8 relative z-10">
        <div className="mb-16 border-b-2 border-atlantis-bg-main pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-atlantis-bg-main text-atlantis-white p-2">
              <User size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">CONFIGURACIÓN</span>
          </div>
          <h1 className="font-syne font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-4">
            MI PERFIL<span className="text-atlantis-primary">.</span>
          </h1>
          <p className="font-plex text-sm uppercase tracking-widest text-atlantis-bg-main/60">
            Mantén al día tu información pública y redes sociales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-12">
            <form onSubmit={handleUpdateProfile} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">NOMBRE ARTÍSTICO</label>
                  <input 
                    type="text"
                    value={formData.artistName}
                    onChange={e => setFormData({...formData, artistName: e.target.value})}
                    className="w-full border-2 border-atlantis-bg-main p-4 font-bold focus:bg-atlantis-primary/5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">EMAIL DE CONTACTO</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full border-2 border-atlantis-bg-main p-4 font-bold focus:bg-atlantis-primary/5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">NOMBRE REAL</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border-2 border-atlantis-bg-main p-4 font-bold focus:bg-atlantis-primary/5 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40">APELLIDOS</label>
                  <input 
                    type="text"
                    value={formData.surname}
                    onChange={e => setFormData({...formData, surname: e.target.value})}
                    className="w-full border-2 border-atlantis-bg-main p-4 font-bold focus:bg-atlantis-primary/5 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">BIOGRAFÍA</label>
                <textarea 
                  rows={6}
                  value={formData.biography}
                  onChange={e => setFormData({...formData, biography: e.target.value})}
                  className="w-full border-2 border-atlantis-bg-main p-4 font-bold focus:bg-atlantis-primary/5 outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-6">
                <button 
                  type="submit"
                  disabled={saving}
                  className="bg-atlantis-bg-main text-atlantis-white px-10 py-5 font-syne font-black text-sm uppercase tracking-widest hover:bg-atlantis-primary transition-all flex items-center gap-3"
                >
                  <Save size={18} />
                  {saving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                </button>
                {successMsg && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-atlantis-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2"
                  >
                    <Check size={16} />
                    {successMsg}
                  </motion.div>
                )}
              </div>
            </form>

            {/* Social Media Management */}
            <div className="pt-12 border-t-2 border-atlantis-bg-main/10">
              <div className="flex items-center gap-3 mb-8">
                <Globe size={24} />
                <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter">REDES SOCIALES</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-3">
                    <select 
                      value={newSocial.tipo}
                      onChange={e => setNewSocial({...newSocial, tipo: e.target.value})}
                      className="w-full border-2 border-atlantis-bg-main p-4 font-bold outline-none appearance-none bg-atlantis-white cursor-pointer"
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
                      placeholder="https://..."
                      value={newSocial.url}
                      onChange={e => setNewSocial({...newSocial, url: e.target.value})}
                      className="w-full border-2 border-atlantis-bg-main p-4 font-bold focus:bg-atlantis-primary/5 outline-none transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button 
                      onClick={handleAddSocial}
                      className="w-full h-full bg-atlantis-bg-main text-atlantis-white p-4 hover:bg-atlantis-primary transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      <span className="font-bold text-xs uppercase">AÑADIR</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socials.map(s => (
                    <div key={s.id} className="border-2 border-atlantis-bg-main p-4 flex justify-between items-center bg-white">
                      <div className="flex items-center gap-4">
                        <span className="bg-atlantis-bg-main text-atlantis-white px-2 py-1 text-[8px] font-black uppercase tracking-widest">{s.tipo}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[200px] opacity-60">{s.url}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteSocial(s.id)}
                        className="text-atlantis-error hover:opacity-50 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Photo Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon size={24} />
              <h2 className="font-syne font-bold text-2xl uppercase tracking-tighter">IMAGEN</h2>
            </div>
            <div className="relative group">
              <div className="aspect-[3/4] border-2 border-atlantis-bg-main overflow-hidden bg-atlantis-bg-alt">
                <img 
                  src={artist?.fotoUrl || defaultArtist} 
                  alt="Profile" 
                  className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0"
                />
              </div>
              <label className="absolute inset-0 bg-atlantis-bg-main/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all">
                <Plus size={40} className="text-atlantis-white mb-2" />
                <span className="text-atlantis-white font-bold text-xs uppercase tracking-widest">Cambiar Foto</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
            <p className="text-[9px] uppercase tracking-widest opacity-40 leading-relaxed">
              * SE RECOMIENDA UNA IMAGEN DE ALTA CALIDAD EN FORMATO VERTICAL PARA MEJOR VISUALIZACIÓN EN LA LANDING.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
