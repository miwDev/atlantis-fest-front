import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createColumnHelper } from "@tanstack/react-table";
import { useFoodtrucks } from "../../hooks/useFoodtrucks";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminModal } from "../../components/admin/AdminModal";
import type { FoodtruckInputDTO } from "../../types/input.dto";
import type { FoodtruckOutputDTO } from "../../types/output.dto";

const columnHelper = createColumnHelper<FoodtruckOutputDTO>();

const emptyForm: FoodtruckInputDTO = {
  email: "",
  username: "",
  password: "",
  nombre: "",
  tipoComida: "",
  zoneId: 0,
  tieneMenuPdf: false
};

export const FoodtrucksPage = () => {
  const { foodtrucks, pagination, foodtruckZones, loading, error: apiError, getFoodtrucks, saveFoodtruck, removeFoodtruck } = useFoodtrucks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [editingFotoUrl, setEditingFotoUrl] = useState<string | undefined>(undefined);
  const [form, setForm] = useState<FoodtruckInputDTO>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FoodtruckInputDTO, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FoodtruckInputDTO, boolean>>>({});
  const [fotoFile, setFotoFile] = useState<File | undefined>(undefined);
  const [fotoPreview, setFotoPreview] = useState<string | undefined>(undefined);
  const [menuPdfFile, setMenuPdfFile] = useState<File | undefined>(undefined);
  const [menuPdfName, setMenuPdfName] = useState<string | undefined>(undefined);
  const [existingPdfUrl, setExistingPdfUrl] = useState<string | undefined>(undefined);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    getFoodtrucks(0);
  }, []);

  const validate = (data: FoodtruckInputDTO) => {
    const newErrors: Partial<Record<keyof FoodtruckInputDTO, string>> = {};

    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!data.email) newErrors.email = "El email no puede estar vacío";
    else if (!emailRegex.test(data.email)) newErrors.email = "Formato de email inválido";

    if (!data.username) newErrors.username = "El nombre de usuario no puede estar vacío";

    if (!editingId) {
      if (!data.password) newErrors.password = "La contraseña no puede estar vacía";
      else if (data.password.length < 8) newErrors.password = "Mínimo 8 caracteres";
    }

    if (!data.nombre) newErrors.nombre = "El nombre no puede estar vacío";
    if (!data.tipoComida) newErrors.tipoComida = "El tipo de comida no puede estar vacío";

    return newErrors;
  };

  useEffect(() => {
    if (modalOpen) {
      setErrors(validate(form));
    }
  }, [form, modalOpen, editingId]);

  const isFormValid = Object.keys(errors).length === 0;

  const openCreate = () => {
    setEditingId(undefined);
    setEditingFotoUrl(undefined);
    setFotoFile(undefined);
    setFotoPreview(undefined);
    setMenuPdfFile(undefined);
    setMenuPdfName(undefined);
    setForm(emptyForm);
    setTouched({});
    setModalOpen(true);
  };

  const openEdit = (foodtruck: FoodtruckOutputDTO) => {
    setEditingId(foodtruck.id);
    setEditingFotoUrl(foodtruck.imagenPortadaUrl);
    setFotoFile(undefined);
    setFotoPreview(undefined);
    setMenuPdfFile(undefined);
    setMenuPdfName(undefined);
    setExistingPdfUrl(foodtruck.tieneMenuPdf ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/foodtrucks/${foodtruck.id}/menu` : undefined);
    setTouched({});
    
    // Find zoneId if we can match by name (since output gives zoneNombre)
    const matchedZone = foodtruckZones.find(z => z.nombre === foodtruck.zoneNombre);

    setForm({
      email: foodtruck.email,
      username: foodtruck.username,
      password: "",
      nombre: foodtruck.nombre,
      tipoComida: foodtruck.tipoComida,
      zoneId: matchedZone?.id || 0,
      tieneMenuPdf: foodtruck.tieneMenuPdf
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const dataToSend = { ...form };
    if (editingId && !dataToSend.password) {
      delete dataToSend.password;
    }

    try {
      await saveFoodtruck(dataToSend, editingId, fotoFile, menuPdfFile);
      setModalOpen(false);
    } catch {}
  };

  const handleDelete = async (id: number) => {
    await removeFoodtruck(id);
    setConfirmDeleteId(null);
  };

  const fotoDropzone = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (files) => {
      const file = files[0];
      if (file) {
        setFotoFile(file);
        setFotoPreview(URL.createObjectURL(file));
      }
    },
  });

  const pdfDropzone = useDropzone({
    accept: { "application/pdf": [] },
    maxFiles: 1,
    onDrop: (files) => {
      const file = files[0];
      if (file) {
        setMenuPdfFile(file);
        setMenuPdfName(file.name);
      }
    },
  });

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => <span className="font-plex text-[10px] font-black text-atlantis-secondary">#{info.getValue()}</span>,
    }),
    columnHelper.accessor("nombre", {
      header: "Nombre",
      cell: (info) => <span className="font-syne font-bold text-atlantis-bg-main uppercase tracking-tight">{info.getValue()}</span>,
    }),
    columnHelper.accessor("tipoComida", {
      header: "Tipo Comida",
      cell: (info) => <span className="font-plex text-[11px] font-bold text-atlantis-secondary">{info.getValue()}</span>,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("zoneNombre", {
      header: "Zona",
      cell: (info) => <span className="font-plex text-[11px] font-bold text-atlantis-secondary">{info.getValue() || "—"}</span>,
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-3">
          <button onClick={() => openEdit(row.original)} className="font-plex text-[10px] font-black uppercase tracking-widest text-atlantis-primary hover:text-atlantis-bg-main transition-colors">Editar</button>
          <button onClick={() => setConfirmDeleteId(row.original.id)} className="font-plex text-[10px] font-black uppercase tracking-widest text-atlantis-error hover:opacity-70 transition-opacity">Borrar</button>
        </div>
      ),
    }),
  ];

  return (
    <div className="container mx-auto max-w-6xl px-8 md:px-16 py-12 space-y-0">
      <AdminPageHeader
        title="FoodTrucks"
        subtitle={`${pagination?.totalElements ?? 0} foodtrucks registrados`}
        onNew={openCreate}
        newLabel="Nuevo FoodTruck"
      />

      {apiError && (
        <div className="mb-6 px-4 py-3 border border-atlantis-error/30 bg-atlantis-error/10 font-plex text-xs text-atlantis-error uppercase tracking-widest">
          {apiError}
        </div>
      )}

      <AdminTable data={foodtrucks} columns={columns} loading={loading} pagination={pagination} onPageChange={(page) => getFoodtrucks(page)} />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar FoodTruck" : "Nuevo FoodTruck"}>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nombre" name="nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} onBlur={() => setTouched({ ...touched, nombre: true })} error={touched.nombre ? errors.nombre : undefined} required />
            <Field label="Tipo de Comida" name="tipoComida" value={form.tipoComida} onChange={(v) => setForm({ ...form, tipoComida: v })} onBlur={() => setTouched({ ...touched, tipoComida: true })} error={touched.tipoComida ? errors.tipoComida : undefined} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Email" name="email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} onBlur={() => setTouched({ ...touched, email: true })} error={touched.email ? errors.email : undefined} required />
            <Field label="Username" name="username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} onBlur={() => setTouched({ ...touched, username: true })} error={touched.username ? errors.username : undefined} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!editingId && (
              <Field label="Contraseña" name="password" type="password" value={form.password ?? ""} onChange={(v) => setForm({ ...form, password: v })} onBlur={() => setTouched({ ...touched, password: true })} error={touched.password ? errors.password : undefined} required />
            )}
            <div className="flex flex-col gap-1">
              <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block">Zona (Opcional)</label>
              <select name="zoneId" value={form.zoneId || ""} onChange={(e) => setForm({ ...form, zoneId: Number(e.target.value) })} className="w-full border px-3 py-2 font-plex text-xs text-atlantis-bg-main bg-atlantis-white focus:outline-none transition-colors border-atlantis-secondary/30 focus:border-atlantis-primary">
                <option value="">Ninguna zona asignada</option>
                {foodtruckZones.map(z => <option key={z.id} value={z.id}>{z.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Foto */}
            <div>
              <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block mb-2">Foto de Portada</label>
              {editingFotoUrl && !fotoPreview && (
                <div className="mb-3 flex items-center gap-3">
                  <img src={editingFotoUrl} alt="Foto actual" className="w-14 h-14 object-cover border border-atlantis-secondary/30" />
                  <span className="font-plex text-[10px] text-atlantis-secondary uppercase tracking-widest">Foto actual</span>
                </div>
              )}
              {fotoPreview && (
                <div className="mb-3 flex items-center gap-3">
                  <img src={fotoPreview} alt="Nueva foto" className="w-14 h-14 object-cover border border-atlantis-primary" />
                  <div>
                    <span className="font-plex text-[10px] text-atlantis-primary uppercase tracking-widest block">Seleccionada ✓</span>
                    <button type="button" onClick={() => { setFotoFile(undefined); setFotoPreview(undefined); }} className="font-plex text-[10px] text-atlantis-error uppercase tracking-widest hover:opacity-70">Quitar</button>
                  </div>
                </div>
              )}
              <div {...fotoDropzone.getRootProps()} className={`border-2 border-dashed px-4 py-4 text-center cursor-pointer transition-colors ${fotoDropzone.isDragActive ? "border-atlantis-primary bg-atlantis-primary/5" : "border-atlantis-secondary/30 hover:border-atlantis-bg-main"}`}>
                <input {...fotoDropzone.getInputProps()} />
                <p className="font-plex text-[10px] uppercase tracking-[0.2em] text-atlantis-secondary">Clic o arrastrar imagen</p>
              </div>
            </div>

            {/* Menu */}
            <div>
              <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block mb-2">Menú (PDF)</label>
              
              {!menuPdfFile && existingPdfUrl && (
                <div className="mb-3 flex flex-col gap-2 p-3 border border-atlantis-secondary/20 bg-atlantis-secondary/5">
                  <div className="flex items-center justify-between">
                    <span className="font-plex text-[10px] font-black text-atlantis-primary uppercase tracking-widest truncate max-w-[150px]">Menú subido ✓</span>
                    <button type="button" onClick={() => { setExistingPdfUrl(undefined); setForm({ ...form, tieneMenuPdf: false }); }} className="font-plex text-[10px] font-black text-atlantis-error uppercase hover:opacity-70">Quitar</button>
                  </div>
                  <a href={existingPdfUrl} target="_blank" rel="noreferrer" className="text-center font-plex text-[10px] font-black uppercase tracking-widest text-atlantis-bg-main bg-atlantis-secondary/20 py-2 hover:bg-atlantis-secondary/30 transition-colors">
                    Ver PDF actual
                  </a>
                </div>
              )}

              {menuPdfName && (
                <div className="mb-3 flex items-center justify-between p-3 border border-atlantis-primary/30 bg-atlantis-primary/5">
                  <span className="font-plex text-[10px] font-black text-atlantis-primary uppercase tracking-widest truncate max-w-[150px]">📄 Nuevo: {menuPdfName}</span>
                  <button type="button" onClick={() => { setMenuPdfFile(undefined); setMenuPdfName(undefined); }} className="font-plex text-[10px] font-black text-atlantis-error uppercase hover:opacity-70">Quitar</button>
                </div>
              )}

              <div {...pdfDropzone.getRootProps()} className={`border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${pdfDropzone.isDragActive ? "border-atlantis-primary bg-atlantis-primary/5" : "border-atlantis-secondary/30 hover:border-atlantis-bg-main"}`}>
                <input {...pdfDropzone.getInputProps()} />
                <p className="font-plex text-[10px] uppercase tracking-[0.2em] text-atlantis-secondary">Clic o arrastrar nuevo PDF</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-atlantis-secondary/20">
            <button type="submit" disabled={loading || !isFormValid} className="flex-1 font-plex text-xs font-black uppercase tracking-[0.2em] bg-atlantis-bg-main text-atlantis-white py-3 hover:bg-atlantis-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear FoodTruck"}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="font-plex text-xs font-black uppercase tracking-[0.2em] border border-atlantis-secondary/30 px-6 text-atlantis-secondary hover:border-atlantis-bg-main hover:text-atlantis-bg-main transition-colors">Cancelar</button>
          </div>
        </form>
      </AdminModal>

      <AdminModal open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} title="Confirmar Eliminación">
        <div className="space-y-6">
          <p className="font-plex text-xs text-atlantis-secondary uppercase tracking-widest">¿Estás seguro de que quieres eliminar este foodtruck?</p>
          <div className="flex gap-3">
            <button onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)} disabled={loading} className="flex-1 font-plex text-xs font-black uppercase tracking-[0.2em] bg-atlantis-error text-atlantis-white py-3 hover:opacity-80 transition-opacity disabled:opacity-50">
              {loading ? "Eliminando..." : "Sí, Eliminar"}
            </button>
            <button onClick={() => setConfirmDeleteId(null)} className="font-plex text-xs font-black uppercase tracking-[0.2em] border border-atlantis-secondary/30 px-6 text-atlantis-secondary hover:border-atlantis-bg-main hover:text-atlantis-bg-main transition-colors">Cancelar</button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

const Field = ({ label, name, value, onChange, onBlur, type = "text", required = false, error }: { label: string; name: string; value: string; onChange: (v: string) => void; onBlur?: () => void; type?: string; required?: boolean; error?: string; }) => (
  <div className="flex flex-col gap-1">
    <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block">{label}</label>
    <input type={type} name={name} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} required={required} className={`w-full border px-3 py-2 font-plex text-xs text-atlantis-bg-main focus:outline-none transition-colors ${error ? "border-atlantis-error focus:border-atlantis-error" : "border-atlantis-secondary/30 focus:border-atlantis-primary"}`} />
    {error && <span className="font-plex text-[9px] font-bold text-atlantis-error uppercase tracking-wider">{error}</span>}
  </div>
);
