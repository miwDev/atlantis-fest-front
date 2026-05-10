import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createColumnHelper, type SortingState } from "@tanstack/react-table";
import { useArtists } from "../../hooks/useArtists";
import { genreService } from "../../services/genre.service";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminModal } from "../../components/admin/AdminModal";
import type { ArtistInputDTO } from "../../types/input.dto";
import type { ArtistOutputDTO, GenreOutputDTO } from "../../types/output.dto";

const columnHelper = createColumnHelper<ArtistOutputDTO>();

const emptyForm: ArtistInputDTO = {
  email: "",
  username: "",
  password: "",
  name: "",
  surname: "",
  artistName: "",
  biography: "",
  genreIds: [],
};

export const ArtistsPage = () => {
  const { artists, pagination, loading, error: apiError, getArtists, saveArtist, removeArtist } = useArtists();

  const [modalOpen, setModalOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [editingFotoUrl, setEditingFotoUrl] = useState<string | undefined>(undefined);
  const [form, setForm] = useState<ArtistInputDTO>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ArtistInputDTO, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ArtistInputDTO, boolean>>>({});
  const [fotoFile, setFotoFile] = useState<File | undefined>(undefined);
  const [fotoPreview, setFotoPreview] = useState<string | undefined>(undefined);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [allGenres, setAllGenres] = useState<GenreOutputDTO[]>([]);

  
  const handleSortingChange = (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
    const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
    setSorting(newSorting);
    if (newSorting.length > 0) {
      const sortStr = `${newSorting[0].id},${newSorting[0].desc ? 'desc' : 'asc'}`;
      getArtists(0, sortStr);
    } else {
      getArtists(0, undefined);
    }
  };

  useEffect(() => {
    getArtists(0);
    genreService.getAll(0, 100).then(res => setAllGenres(res.content)).catch(console.error);
  }, []);

  const validate = (data: ArtistInputDTO) => {
    const newErrors: Partial<Record<keyof ArtistInputDTO, string>> = {};

    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!data.email) newErrors.email = "El email no puede estar vacío";
    else if (!emailRegex.test(data.email)) newErrors.email = "Formato de email inválido";

    if (!data.username) newErrors.username = "El nombre de usuario no puede estar vacío";
    else if (data.username.length > 50) newErrors.username = "Máximo 50 caracteres";

    // Password obligatorio en creación, opcional en edición si no se quiere cambiar
    if (!editingId) {
      if (!data.password) newErrors.password = "La contraseña no puede estar vacía";
      else if (data.password.length < 8) newErrors.password = "Mínimo 8 caracteres";
    } else if (data.password && data.password.length < 8) {
      newErrors.password = "Mínimo 8 caracteres";
    }

    if (!data.name) newErrors.name = "El nombre no puede estar vacío";
    else if (data.name.length > 100) newErrors.name = "Máximo 100 caracteres";

    if (!data.surname) newErrors.surname = "El apellido no puede estar vacío";
    else if (data.surname.length > 100) newErrors.surname = "Máximo 100 caracteres";

    if (!data.artistName) newErrors.artistName = "El nombre artístico no puede estar vacío";
    else if (data.artistName.length > 100) newErrors.artistName = "Máximo 100 caracteres";

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
    setForm(emptyForm);
    setTouched({});
    setModalOpen(true);
  };

  const openEdit = (artist: ArtistOutputDTO) => {
    console.log("Editando artista:", artist);
    setEditingId(artist.id);
    setEditingFotoUrl(artist.fotoUrl);
    setFotoFile(undefined);
    setFotoPreview(undefined);
    setTouched({});
    
    const mappedGenreIds = allGenres.filter(g => artist.genres?.includes(g.nombre)).map(g => g.id);
    
    setForm({
      email: artist.email,
      username: artist.username,
      password: "", 
      name: artist.name || "", 
      surname: artist.surname || "",
      artistName: artist.artistName,
      biography: artist.biography ?? "",
      genreIds: mappedGenreIds,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    // Si estamos editando y el password está vacío, no lo enviamos
    const dataToSend = { ...form };
    if (editingId && !dataToSend.password) {
      delete dataToSend.password;
    }

    try {
      await saveArtist(dataToSend, editingId, fotoFile);
      setModalOpen(false);
    } catch {
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

  const handleDelete = async (id: number) => {
    await removeArtist(id);
    setConfirmDeleteId(null);
  };

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <span className="font-plex text-[10px] font-black text-atlantis-secondary">
          #{info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("artistName", {
      header: "Nombre Artístico",
      cell: (info) => (
        <span className="font-syne font-bold text-atlantis-bg-main uppercase tracking-tight">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("genres", {
      header: "Géneros",
      cell: (info) => {
        const genres = info.getValue();
        if (!genres || genres.length === 0) return <span className="text-atlantis-secondary">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="font-plex text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-atlantis-bg-main text-atlantis-white"
              >
                {g}
              </span>
            ))}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-3">
          <button
            onClick={() => openEdit(row.original)}
            className="font-plex text-[10px] font-black uppercase tracking-widest text-atlantis-primary hover:text-atlantis-bg-main transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => setConfirmDeleteId(row.original.id)}
            className="font-plex text-[10px] font-black uppercase tracking-widest text-atlantis-error hover:opacity-70 transition-opacity"
          >
            Borrar
          </button>
        </div>
      ),
    }),
  ];

  return (
    <div className="container mx-auto max-w-6xl px-8 md:px-16 py-12 space-y-0">
      <AdminPageHeader
        title="Artistas"
        subtitle={`${pagination?.totalElements ?? 0} artistas registrados`}
        onNew={openCreate}
        newLabel="Nuevo Artista"
      />

      {apiError && (
        <div className="mb-6 px-4 py-3 border border-atlantis-error/30 bg-atlantis-error/10 font-plex text-xs text-atlantis-error uppercase tracking-widest">
          {apiError}
        </div>
      )}

      <AdminTable
        data={artists}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => getArtists(page)}
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar Artista" : "Nuevo Artista"}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Nombre"
              name="name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              onBlur={() => setTouched({ ...touched, name: true })}
              error={touched.name ? errors.name : undefined}
              required
            />
            <Field
              label="Apellidos"
              name="surname"
              value={form.surname}
              onChange={(v) => setForm({ ...form, surname: v })}
              onBlur={() => setTouched({ ...touched, surname: true })}
              error={touched.surname ? errors.surname : undefined}
              required
            />
          </div>
          <Field
            label="Nombre Artístico"
            name="artistName"
            value={form.artistName}
            onChange={(v) => setForm({ ...form, artistName: v })}
            onBlur={() => setTouched({ ...touched, artistName: true })}
            error={touched.artistName ? errors.artistName : undefined}
            required
          />
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            onBlur={() => setTouched({ ...touched, email: true })}
            error={touched.email ? errors.email : undefined}
            required
          />
          <Field
            label="Username"
            name="username"
            value={form.username}
            onChange={(v) => setForm({ ...form, username: v })}
            onBlur={() => setTouched({ ...touched, username: true })}
            error={touched.username ? errors.username : undefined}
            required
          />
          {!editingId && (
            <Field
              label="Contraseña"
              name="password"
              type="password"
              value={form.password ?? ""}
              onChange={(v) => setForm({ ...form, password: v })}
              onBlur={() => setTouched({ ...touched, password: true })}
              error={touched.password ? errors.password : undefined}
              required
            />
          )}
          <div>
            <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block mb-1">
              Biografía
            </label>
            <textarea
              value={form.biography ?? ""}
              onChange={(e) => setForm({ ...form, biography: e.target.value })}
              rows={3}
              className="w-full border border-atlantis-secondary/30 bg-atlantis-white px-3 py-2 font-plex text-xs text-atlantis-bg-main focus:outline-none focus:border-atlantis-primary resize-none"
            />
          </div>

          <div>
            <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block mb-2">
              Géneros Musicales
            </label>
            <div className="flex flex-wrap gap-2">
              {allGenres.length === 0 ? (
                 <span className="font-plex text-[10px] text-atlantis-secondary/50 uppercase tracking-widest">Cargando géneros...</span>
              ) : allGenres.map(g => {
                const currentGenreIds = form.genreIds || [];
                const isSelected = currentGenreIds.includes(g.id);
                return (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => {
                      if (isSelected) {
                        setForm({...form, genreIds: currentGenreIds.filter(id => id !== g.id)});
                      } else {
                        setForm({...form, genreIds: [...currentGenreIds, g.id]});
                      }
                    }}
                    className={`font-plex text-[9px] font-black uppercase tracking-wider px-3 py-1 border transition-colors ${
                      isSelected 
                        ? 'bg-atlantis-bg-main text-atlantis-white border-atlantis-bg-main' 
                        : 'bg-transparent text-atlantis-secondary border-atlantis-secondary/30 hover:border-atlantis-primary hover:text-atlantis-primary'
                    }`}
                  >
                    {g.nombre}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block mb-2">
              Foto del Artista
            </label>
            {editingFotoUrl && !fotoPreview && (
              <div className="mb-3 flex items-center gap-3">
                <img src={editingFotoUrl} alt="Foto actual" className="w-14 h-14 object-cover border border-atlantis-secondary/30" />
                <span className="font-plex text-[10px] text-atlantis-secondary uppercase tracking-widest">Foto actual — arrastra para reemplazar</span>
              </div>
            )}
            {fotoPreview && (
              <div className="mb-3 flex items-center gap-3">
                <img src={fotoPreview} alt="Nueva foto" className="w-14 h-14 object-cover border border-atlantis-primary" />
                <div>
                  <span className="font-plex text-[10px] text-atlantis-primary uppercase tracking-widest block">Nueva foto seleccionada ✓</span>
                  <button type="button" onClick={() => { setFotoFile(undefined); setFotoPreview(undefined); }} className="font-plex text-[10px] text-atlantis-error uppercase tracking-widest hover:opacity-70">Quitar</button>
                </div>
              </div>
            )}
            <div {...getRootProps()} className={`border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors duration-200 ${isDragActive ? "border-atlantis-primary bg-atlantis-primary/5" : "border-atlantis-secondary/30 hover:border-atlantis-bg-main"}`}>
              <input {...getInputProps()} />
              <p className="font-plex text-[10px] uppercase tracking-[0.2em] text-atlantis-secondary">{isDragActive ? "Suelta la imagen aquí..." : "Arrastra una imagen o haz clic para seleccionar"}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-atlantis-secondary/20">
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="flex-1 font-plex text-xs font-black uppercase tracking-[0.2em] bg-atlantis-bg-main text-atlantis-white py-3 hover:bg-atlantis-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear Artista"}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="font-plex text-xs font-black uppercase tracking-[0.2em] border border-atlantis-secondary/30 px-6 text-atlantis-secondary hover:border-atlantis-bg-main hover:text-atlantis-bg-main transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-6">
          <p className="font-plex text-xs text-atlantis-secondary uppercase tracking-widest">
            ¿Estás seguro de que quieres eliminar este artista? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              disabled={loading}
              className="flex-1 font-plex text-xs font-black uppercase tracking-[0.2em] bg-atlantis-error text-atlantis-white py-3 hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {loading ? "Eliminando..." : "Sí, Eliminar"}
            </button>
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="font-plex text-xs font-black uppercase tracking-[0.2em] border border-atlantis-secondary/30 px-6 text-atlantis-secondary hover:border-atlantis-bg-main hover:text-atlantis-bg-main transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = "text",
  required = false,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
  required?: boolean;
  error?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      required={required}
      className={`w-full border px-3 py-2 font-plex text-xs text-atlantis-bg-main focus:outline-none transition-colors ${
        error ? "border-atlantis-error focus:border-atlantis-error" : "border-atlantis-secondary/30 focus:border-atlantis-primary"
      }`}
    />
    {error && (
      <span className="font-plex text-[9px] font-bold text-atlantis-error uppercase tracking-wider">
        {error}
      </span>
    )}
  </div>
);
