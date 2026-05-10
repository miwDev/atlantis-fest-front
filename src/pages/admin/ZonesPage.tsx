import { useEffect, useState } from "react";
import { createColumnHelper, type SortingState } from "@tanstack/react-table";
import { useZones } from "../../hooks/useZones";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminModal } from "../../components/admin/AdminModal";
import type { ZoneInputDTO } from "../../types/input.dto";
import type { ZoneOutputDTO } from "../../types/output.dto";

const columnHelper = createColumnHelper<ZoneOutputDTO>();

const emptyForm: ZoneInputDTO = {
  nombre: "",
  descripcion: "",
  tipo: "",
  festivalId: 1 // TODO: idealmente un selector de festival si hay varios
};

export const ZonesPage = () => {
  const { zones, pagination, tipos, loading, error: apiError, getZones, saveZone, removeZone } = useZones();

  const [modalOpen, setModalOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [form, setForm] = useState<ZoneInputDTO>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ZoneInputDTO, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ZoneInputDTO, boolean>>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  
  const handleSortingChange = (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
    const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
    setSorting(newSorting);
    if (newSorting.length > 0) {
      const sortStr = `${newSorting[0].id},${newSorting[0].desc ? 'desc' : 'asc'}`;
      getZones(0, sortStr);
    } else {
      getZones(0, undefined);
    }
  };

  useEffect(() => {
    getZones(0);
  }, []);

  const validate = (data: ZoneInputDTO) => {
    const newErrors: Partial<Record<keyof ZoneInputDTO, string>> = {};
    if (!data.nombre) newErrors.nombre = "El nombre no puede estar vacío";
    if (!data.tipo) newErrors.tipo = "El tipo no puede estar vacío";
    if (!data.festivalId) newErrors.festivalId = "Debes seleccionar un festival";
    return newErrors;
  };

  useEffect(() => {
    if (modalOpen) setErrors(validate(form));
  }, [form, modalOpen]);

  const isFormValid = Object.keys(errors).length === 0;

  const openEdit = (zone: ZoneOutputDTO) => {
    setEditingId(zone.id);
    setTouched({});
    setForm({
      nombre: zone.nombre,
      descripcion: zone.descripcion || "",
      tipo: zone.tipo,
      festivalId: 1 // Usamos 1 por defecto de momento, si el back devuelve festivalId en el DTO habría que usarlo
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    try {
      await saveZone(form, editingId);
      setModalOpen(false);
    } catch {}
  };

  const handleDelete = async (id: number) => {
    await removeZone(id);
    setConfirmDeleteId(null);
  };

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => <span className="font-plex text-[10px] font-black text-atlantis-secondary">#{info.getValue()}</span>,
    }),
    columnHelper.accessor("nombre", {
      header: "Nombre",
      cell: (info) => <span className="font-syne font-bold text-atlantis-bg-main uppercase">{info.getValue()}</span>,
    }),
    columnHelper.accessor("tipo", {
      header: "Tipo",
      cell: (info) => <span className="font-plex text-[11px] font-bold text-atlantis-secondary uppercase">{info.getValue()}</span>,
    }),
    columnHelper.accessor("festivalNombre", {
      header: "Festival",
      cell: (info) => <span className="font-plex text-[11px] text-atlantis-secondary">{info.getValue()}</span>,
    }),
    columnHelper.display({
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-3">
          <button onClick={() => openEdit(row.original)} className="font-plex text-[10px] font-black uppercase text-atlantis-primary hover:text-atlantis-bg-main transition-colors">Editar</button>
          <button onClick={() => setConfirmDeleteId(row.original.id)} className="font-plex text-[10px] font-black uppercase text-atlantis-error hover:opacity-70 transition-opacity">Borrar</button>
        </div>
      ),
    }),
  ];

  return (
    <div className="container mx-auto max-w-6xl px-8 md:px-16 py-12 space-y-0">
      <AdminPageHeader
        title="Zonas"
        subtitle={`${pagination?.totalElements ?? 0} zonas configuradas`}
      />

      {apiError && (
        <div className="mb-6 px-4 py-3 border border-atlantis-error/30 bg-atlantis-error/10 font-plex text-xs text-atlantis-error uppercase tracking-widest">
          {apiError}
        </div>
      )}

      <AdminTable
        data={zones}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => getZones(page)}
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar Zona" : "Nueva Zona"}>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nombre" name="nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} onBlur={() => setTouched({ ...touched, nombre: true })} error={touched.nombre ? errors.nombre : undefined} required />
            
            <div className="flex flex-col gap-1">
              <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block">
                Tipo
              </label>
              <select
                name="tipo"
                value={form.tipo || ""}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                onBlur={() => setTouched({ ...touched, tipo: true })}
                required
                className={`w-full border px-3 py-2 font-plex text-xs text-atlantis-bg-main focus:outline-none transition-colors appearance-none bg-atlantis-white ${
                  touched.tipo && errors.tipo ? "border-atlantis-error focus:border-atlantis-error" : "border-atlantis-secondary/30 focus:border-atlantis-primary"
                }`}
              >
                <option value="" disabled>Selecciona un tipo</option>
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              {touched.tipo && errors.tipo && (
                <span className="font-plex text-[9px] font-bold text-atlantis-error uppercase tracking-wider">
                  {errors.tipo}
                </span>
              )}
            </div>
          </div>

          <Field label="Descripción" name="descripcion" value={form.descripcion || ""} onChange={(v) => setForm({ ...form, descripcion: v })} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="ID Festival" name="festivalId" type="number" value={form.festivalId.toString()} onChange={(v) => setForm({ ...form, festivalId: Number(v) })} onBlur={() => setTouched({ ...touched, festivalId: true })} error={touched.festivalId ? errors.festivalId : undefined} required />
          </div>

          <div className="flex gap-3 pt-4 border-t border-atlantis-secondary/20">
            <button type="submit" disabled={loading || !isFormValid} className="flex-1 font-plex text-xs font-black uppercase tracking-[0.2em] bg-atlantis-bg-main text-atlantis-white py-3 hover:bg-atlantis-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear Zona"}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="font-plex text-xs font-black uppercase tracking-[0.2em] border border-atlantis-secondary/30 px-6 text-atlantis-secondary hover:border-atlantis-bg-main hover:text-atlantis-bg-main transition-colors">Cancelar</button>
          </div>
        </form>
      </AdminModal>

      <AdminModal open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} title="Confirmar Eliminación">
        <div className="space-y-6">
          <p className="font-plex text-xs text-atlantis-secondary uppercase tracking-widest">¿Estás seguro de que quieres eliminar esta zona? Esta acción no se puede deshacer.</p>
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
