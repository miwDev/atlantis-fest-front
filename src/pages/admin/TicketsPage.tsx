import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useTickets } from "../../hooks/useTickets";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminModal } from "../../components/admin/AdminModal";
import type { TicketTypeInputDTO } from "../../types/input.dto";
import type { TicketTypeOutputDTO } from "../../types/output.dto";

const columnHelper = createColumnHelper<TicketTypeOutputDTO>();

const emptyForm: TicketTypeInputDTO = {
  tipo: "",
  precioBase: 0,
  maxDisponible: 0,
  descripcion: "",
  festivalId: 1 // Por defecto, asumimos 1 o requerirá un selector de festivales si hay múltiples
};

export const TicketsPage = () => {
  const { tickets, pagination, loading, error: apiError, getTickets, saveTicket, removeTicket } = useTickets();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [form, setForm] = useState<TicketTypeInputDTO>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof TicketTypeInputDTO, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof TicketTypeInputDTO, boolean>>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    getTickets(0);
  }, []);

  const validate = (data: TicketTypeInputDTO) => {
    const newErrors: Partial<Record<keyof TicketTypeInputDTO, string>> = {};
    if (!data.tipo) newErrors.tipo = "El tipo no puede estar vacío";
    if (data.precioBase < 0) newErrors.precioBase = "El precio no puede ser negativo";
    if (data.maxDisponible < 1) newErrors.maxDisponible = "Debe haber al menos 1 ticket disponible";
    if (!data.festivalId) newErrors.festivalId = "Debes asignar el ticket a un festival";
    return newErrors;
  };

  useEffect(() => {
    if (modalOpen) setErrors(validate(form));
  }, [form, modalOpen]);

  const isFormValid = Object.keys(errors).length === 0;

  const openEdit = (ticket: TicketTypeOutputDTO) => {
    setEditingId(ticket.id);
    setTouched({});
    setForm({
      tipo: ticket.tipo,
      precioBase: ticket.precioBase,
      maxDisponible: ticket.maxDisponible,
      descripcion: ticket.descripcion || "",
      festivalId: 1 // Forzado temporalmente hasta implementar el selector de festivales globales
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    try {
      await saveTicket(form, editingId);
      setModalOpen(false);
    } catch {}
  };

  const handleDelete = async (id: number) => {
    await removeTicket(id);
    setConfirmDeleteId(null);
  };

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => <span className="font-plex text-[10px] font-black text-atlantis-secondary">#{info.getValue()}</span>,
    }),
    columnHelper.accessor("tipo", {
      header: "Tipo",
      cell: (info) => <span className="font-syne font-bold text-atlantis-bg-main uppercase">{info.getValue()}</span>,
    }),
    columnHelper.accessor("precioBase", {
      header: "Precio Base",
      cell: (info) => <span className="font-plex text-[11px] font-bold text-atlantis-primary">{info.getValue()}€</span>,
    }),
    columnHelper.accessor("maxDisponible", {
      header: "Disponibilidad",
      cell: (info) => <span className="font-plex text-[11px] font-bold text-atlantis-secondary">{info.getValue()}</span>,
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
        title="Tipos de Tickets"
        subtitle={`${pagination?.totalElements ?? 0} tickets registrados en el sistema`}
      />

      {apiError && (
        <div className="mb-6 px-4 py-3 border border-atlantis-error/30 bg-atlantis-error/10 font-plex text-xs text-atlantis-error uppercase tracking-widest">
          {apiError}
        </div>
      )}

      <AdminTable
        data={tickets}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => getTickets(page)}
      />

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title="Editar Ticket">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Tipo (ej: VIP, General)" name="tipo" value={form.tipo} onChange={(v) => setForm({ ...form, tipo: v })} onBlur={() => setTouched({ ...touched, tipo: true })} error={touched.tipo ? errors.tipo : undefined} required disabled={!!editingId} />
            <Field label="ID Festival" name="festivalId" type="number" value={form.festivalId.toString()} onChange={(v) => setForm({ ...form, festivalId: Number(v) })} onBlur={() => setTouched({ ...touched, festivalId: true })} error={touched.festivalId ? errors.festivalId : undefined} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Precio Base (€)" name="precioBase" type="number" step="0.01" value={form.precioBase.toString()} onChange={(v) => setForm({ ...form, precioBase: Number(v) })} onBlur={() => setTouched({ ...touched, precioBase: true })} error={touched.precioBase ? errors.precioBase : undefined} required />
            <Field label="Máxima Disponibilidad" name="maxDisponible" type="number" value={form.maxDisponible.toString()} onChange={(v) => setForm({ ...form, maxDisponible: Number(v) })} onBlur={() => setTouched({ ...touched, maxDisponible: true })} error={touched.maxDisponible ? errors.maxDisponible : undefined} required />
          </div>

          <Field label="Descripción" name="descripcion" value={form.descripcion || ""} onChange={(v) => setForm({ ...form, descripcion: v })} />

          <div className="flex gap-3 pt-4 border-t border-atlantis-secondary/20">
            <button type="submit" disabled={loading || !isFormValid} className="flex-1 font-plex text-xs font-black uppercase tracking-[0.2em] bg-atlantis-bg-main text-atlantis-white py-3 hover:bg-atlantis-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              {loading ? "Guardando..." : "Actualizar Ticket"}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="font-plex text-xs font-black uppercase tracking-[0.2em] border border-atlantis-secondary/30 px-6 text-atlantis-secondary hover:border-atlantis-bg-main hover:text-atlantis-bg-main transition-colors">Cancelar</button>
          </div>
        </form>
      </AdminModal>

      <AdminModal open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)} title="Confirmar Eliminación">
        <div className="space-y-6">
          <p className="font-plex text-xs text-atlantis-secondary uppercase tracking-widest">¿Estás seguro de que quieres eliminar este ticket? Esta acción no se puede deshacer y puede afectar a compras existentes.</p>
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

const Field = ({ label, name, value, onChange, onBlur, type = "text", step, required = false, disabled = false, error }: { label: string; name: string; value: string; onChange: (v: string) => void; onBlur?: () => void; type?: string; step?: string; required?: boolean; disabled?: boolean; error?: string; }) => (
  <div className="flex flex-col gap-1">
    <label className="font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-secondary block">{label}</label>
    <input type={type} step={step} name={name} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} required={required} disabled={disabled} className={`w-full border px-3 py-2 font-plex text-xs text-atlantis-bg-main focus:outline-none transition-colors ${disabled ? "bg-atlantis-secondary/10 cursor-not-allowed opacity-70" : "bg-atlantis-white"} ${error ? "border-atlantis-error focus:border-atlantis-error" : "border-atlantis-secondary/30 focus:border-atlantis-primary"}`} />
    {error && <span className="font-plex text-[9px] font-bold text-atlantis-error uppercase tracking-wider">{error}</span>}
  </div>
);
