import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useConcerts } from "../../hooks/useConcerts";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminModal } from "../../components/admin/AdminModal";
import type { ConcertInputDTO } from "../../types/input.dto";
import type { ConcertOutputDTO } from "../../types/output.dto";

const columnHelper = createColumnHelper<ConcertOutputDTO>();

const emptyForm: ConcertInputDTO = {
  fecha: "",
  horaInicio: "",
  horaFin: "",
  artistId: 0,
  zoneId: 0,
};

export const ConcertsPage = () => {
  const {
    groupedConcerts,
    rawConcerts,
    festival,
    zones,
    artists,
    loading,
    error: apiError,
    loadData,
    saveConcert,
    removeConcert,
  } = useConcerts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [form, setForm] = useState<ConcertInputDTO>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ConcertInputDTO, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ConcertInputDTO, boolean>>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const validateOverlap = (data: ConcertInputDTO) => {
    return rawConcerts.some((c) => {
      // Don't validate against itself
      if (editingId && c.id === editingId) return false;
      
      // We need to match same day, same zone
      if (c.fecha === data.fecha && c.zoneName === zones.find(z => z.id === data.zoneId)?.nombre) {
        // Check time overlap
        // Two time intervals [A, B] and [C, D] overlap if max(A, C) < min(B, D)
        const aStart = data.horaInicio;
        const aEnd = data.horaFin;
        const cStart = c.horaInicio;
        const cEnd = c.horaFin;
        
        if (aStart < cEnd && aEnd > cStart) {
          return true; // Overlap detected
        }
      }
      return false;
    });
  };

  const validate = (data: ConcertInputDTO) => {
    const newErrors: Partial<Record<keyof ConcertInputDTO, string>> = {};
    if (!data.fecha) newErrors.fecha = "La fecha es requerida";
    else if (festival) {
      const festivalStart = festival.fechaInicio.split("T")[0];
      const festivalEnd = festival.fechaFin.split("T")[0];
      if (data.fecha < festivalStart || data.fecha > festivalEnd) {
        newErrors.fecha = `La fecha debe estar entre ${festivalStart} y ${festivalEnd}`;
      }
    }

    if (!data.horaInicio) newErrors.horaInicio = "Hora inicio requerida";
    if (!data.horaFin) newErrors.horaFin = "Hora fin requerida";
    if (data.horaInicio && data.horaFin && data.horaInicio >= data.horaFin) {
      newErrors.horaFin = "La hora de fin debe ser posterior a la de inicio";
    }

    if (!data.artistId) newErrors.artistId = "Selecciona un artista";
    if (!data.zoneId) newErrors.zoneId = "Selecciona una zona";

    return newErrors;
  };

  useEffect(() => {
    if (modalOpen) {
      setErrors(validate(form));
      setCustomError(null);
    }
  }, [form, modalOpen, festival]);

  const isFormValid = Object.keys(errors).length === 0;

  const openCreate = () => {
    setEditingId(undefined);
    setForm(emptyForm);
    setTouched({});
    setModalOpen(true);
  };

  const openEdit = (concert: ConcertOutputDTO) => {
    setEditingId(concert.id);
    setTouched({});
    
    // Find matching IDs based on names (since output DTO gives names, input expects IDs)
    const matchedZone = zones.find(z => z.nombre === concert.zoneName);
    const matchedArtist = artists.find(a => a.artistName === concert.artistName);

    setForm({
      fecha: concert.fecha,
      horaInicio: concert.horaInicio,
      horaFin: concert.horaFin,
      zoneId: matchedZone?.id || 0,
      artistId: matchedArtist?.id || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    if (validateOverlap(form)) {
      setCustomError("Existe un conflicto de horarios. Ya hay un concierto en esa zona a esa hora.");
      return;
    }

    try {
      await saveConcert(form, editingId);
      setModalOpen(false);
    } catch {}
  };

  const handleDelete = async (id: number) => {
    await removeConcert(id);
    setConfirmDeleteId(null);
  };

  const columns = [
    columnHelper.accessor("horaInicio", {
      header: "Inicio",
      cell: (info) => <span className="font-plex text-xs font-black text-atlantis-primary">{info.getValue().substring(0, 5)}</span>,
    }),
    columnHelper.accessor("horaFin", {
      header: "Fin",
      cell: (info) => <span className="font-plex text-xs font-black text-atlantis-secondary">{info.getValue().substring(0, 5)}</span>,
    }),
    columnHelper.accessor("artistName", {
      header: "Artista",
      cell: (info) => <span className="font-syne font-bold text-lg text-atlantis-bg-main uppercase tracking-tight">{info.getValue()}</span>,
    }),
    columnHelper.accessor("zoneName", {
      header: "Zona",
      cell: (info) => <span className="font-plex text-[11px] font-bold text-atlantis-secondary">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-3 justify-end pr-4">
          <button onClick={() => openEdit(row.original)} className="font-plex text-[10px] font-black uppercase text-atlantis-primary hover:text-atlantis-bg-main transition-colors">Editar</button>
          <button onClick={() => setConfirmDeleteId(row.original.id)} className="font-plex text-[10px] font-black uppercase text-atlantis-error hover:opacity-70 transition-opacity">Borrar</button>
        </div>
      ),
    }),
  ];

  return (
    <div className="container mx-auto max-w-6xl px-8 md:px-16 py-12 space-y-12">
      <AdminPageHeader
        title="Conciertos"
        subtitle={`${rawConcerts.length} actuaciones programadas en total`}
        onNew={openCreate}
        newLabel="Añadir Concierto"
      />

      {apiError && (
        <div className="px-4 py-3 border border-atlantis-error/30 bg-atlantis-error/10 font-plex text-xs text-atlantis-error uppercase tracking-widest">
          {apiError}
        </div>
      )}

      {loading && groupedConcerts.length === 0 ? (
        <div className="text-center py-10 font-plex text-xs text-atlantis-secondary uppercase tracking-widest">Cargando conciertos...</div>
      ) : groupedConcerts.length === 0 ? (
        <div className="text-center py-10 font-plex text-xs text-atlantis-secondary uppercase tracking-widest border border-dashed border-atlantis-secondary/30">
          No hay conciertos programados.
        </div>
      ) : (
        <div className="space-y-12">
          {groupedConcerts.map(group => {
            const dateObj = new Date(group.date);
            const dateFormatted = dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
            
            return (
              <div key={group.date} className="space-y-4">
                <div className="flex items-center gap-4 border-b border-atlantis-secondary/20 pb-2">
                  <h2 className="font-syne font-bold text-2xl text-atlantis-bg-main uppercase tracking-tight capitalize">
                    {dateFormatted}
                  </h2>
                  <span className="font-plex text-[10px] font-black uppercase tracking-[0.2em] bg-atlantis-primary/10 text-atlantis-primary px-3 py-1 rounded-full">
                    {group.date}
                  </span>
                  <span className="font-plex text-[10px] font-black uppercase tracking-widest text-atlantis-secondary ml-auto">
                    {group.concerts.length} conciertos
                  </span>
                </div>
                
                <AdminTable
                  data={group.concerts}
                  columns={columns}
                  loading={false}
                />
              </div>
            );
          })}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar Concierto" : "Nuevo Concierto"}>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          
          {customError && (
            <div className="px-3 py-2 bg-atlantis-error/10 border border-atlantis-error/30 font-plex text-[10px] font-black text-atlantis-error uppercase tracking-wider">
              ⚠️ {customError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block">Fecha</label>
              <input 
                type="date" 
                name="fecha" 
                value={form.fecha} 
                min={festival?.fechaInicio ? festival.fechaInicio.split("T")[0] : undefined}
                max={festival?.fechaFin ? festival.fechaFin.split("T")[0] : undefined}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })} 
                onBlur={() => setTouched({ ...touched, fecha: true })} 
                required 
                className={`w-full border px-3 py-2 font-plex text-xs text-atlantis-bg-main focus:outline-none transition-colors ${touched.fecha && errors.fecha ? "border-atlantis-error focus:border-atlantis-error" : "border-atlantis-secondary/30 focus:border-atlantis-primary"}`} 
              />
              {touched.fecha && errors.fecha && <span className="font-plex text-[9px] font-bold text-atlantis-error uppercase tracking-wider">{errors.fecha}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block">Hora Inicio</label>
              <input type="time" name="horaInicio" value={form.horaInicio} onChange={(e) => setForm({ ...form, horaInicio: e.target.value })} onBlur={() => setTouched({ ...touched, horaInicio: true })} required className={`w-full border px-3 py-2 font-plex text-xs text-atlantis-bg-main focus:outline-none transition-colors ${touched.horaInicio && errors.horaInicio ? "border-atlantis-error focus:border-atlantis-error" : "border-atlantis-secondary/30 focus:border-atlantis-primary"}`} />
              {touched.horaInicio && errors.horaInicio && <span className="font-plex text-[9px] font-bold text-atlantis-error uppercase tracking-wider">{errors.horaInicio}</span>}
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block">Hora Fin</label>
              <input type="time" name="horaFin" value={form.horaFin} onChange={(e) => setForm({ ...form, horaFin: e.target.value })} onBlur={() => setTouched({ ...touched, horaFin: true })} required className={`w-full border px-3 py-2 font-plex text-xs text-atlantis-bg-main focus:outline-none transition-colors ${touched.horaFin && errors.horaFin ? "border-atlantis-error focus:border-atlantis-error" : "border-atlantis-secondary/30 focus:border-atlantis-primary"}`} />
              {touched.horaFin && errors.horaFin && <span className="font-plex text-[9px] font-bold text-atlantis-error uppercase tracking-wider">{errors.horaFin}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block">Artista</label>
              <select name="artistId" value={form.artistId || ""} onChange={(e) => setForm({ ...form, artistId: Number(e.target.value) })} onBlur={() => setTouched({ ...touched, artistId: true })} required className={`w-full border px-3 py-2 font-plex text-xs text-atlantis-bg-main bg-atlantis-white focus:outline-none transition-colors ${touched.artistId && errors.artistId ? "border-atlantis-error focus:border-atlantis-error" : "border-atlantis-secondary/30 focus:border-atlantis-primary"}`}>
                <option value="" disabled>Seleccionar artista</option>
                {artists.map(a => <option key={a.id} value={a.id}>{a.artistName}</option>)}
              </select>
              {touched.artistId && errors.artistId && <span className="font-plex text-[9px] font-bold text-atlantis-error uppercase tracking-wider">{errors.artistId}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block">Zona</label>
              <select name="zoneId" value={form.zoneId || ""} onChange={(e) => setForm({ ...form, zoneId: Number(e.target.value) })} onBlur={() => setTouched({ ...touched, zoneId: true })} required className={`w-full border px-3 py-2 font-plex text-xs text-atlantis-bg-main bg-atlantis-white focus:outline-none transition-colors ${touched.zoneId && errors.zoneId ? "border-atlantis-error focus:border-atlantis-error" : "border-atlantis-secondary/30 focus:border-atlantis-primary"}`}>
                <option value="" disabled>Seleccionar zona</option>
                {zones.map(z => <option key={z.id} value={z.id}>{z.nombre} ({z.tipo})</option>)}
              </select>
              {touched.zoneId && errors.zoneId && <span className="font-plex text-[9px] font-bold text-atlantis-error uppercase tracking-wider">{errors.zoneId}</span>}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-atlantis-secondary/20">
            <button type="submit" disabled={loading || !isFormValid} className="flex-1 font-plex text-xs font-black uppercase tracking-[0.2em] bg-atlantis-bg-main text-atlantis-white py-3 hover:bg-atlantis-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              {loading ? "Guardando..." : editingId ? "Actualizar" : "Añadir Concierto"}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="font-plex text-xs font-black uppercase tracking-[0.2em] border border-atlantis-secondary/30 px-6 text-atlantis-secondary hover:border-atlantis-bg-main hover:text-atlantis-bg-main transition-colors">Cancelar</button>
          </div>
        </form>
      </AdminModal>

      <AdminModal open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} title="Confirmar Eliminación">
        <div className="space-y-6">
          <p className="font-plex text-xs text-atlantis-secondary uppercase tracking-widest">¿Seguro que quieres borrar este concierto? El artista y la zona dejarán de estar ocupados a esa hora.</p>
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
