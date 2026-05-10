import { useEffect, useState } from "react";
import { createColumnHelper, type SortingState } from "@tanstack/react-table";
import { useClients } from "../../hooks/useClients";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { AdminTable } from "../../components/admin/AdminTable";
import { AdminModal } from "../../components/admin/AdminModal";
import type { ClientInputDTO } from "../../types/input.dto";
import type { ClientOutputDTO } from "../../types/output.dto";

const columnHelper = createColumnHelper<ClientOutputDTO>();

const emptyForm: ClientInputDTO = {
  email: "",
  username: "",
  password: "",
  nombre: "",
  apellidos: "",
  dni: "",
  fechaNacimiento: "",
  favoriteGenreIds: [],
};

export const ClientsPage = () => {
  const { clients, pagination, loading, error: apiError, getClients, saveClient, removeClient } = useClients();

  const [modalOpen, setModalOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [form, setForm] = useState<ClientInputDTO>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientInputDTO, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ClientInputDTO, boolean>>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  
  const handleSortingChange = (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
    const newSorting = typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue;
    setSorting(newSorting);
    if (newSorting.length > 0) {
      const sortStr = `${newSorting[0].id},${newSorting[0].desc ? 'desc' : 'asc'}`;
      getClients(0, sortStr);
    } else {
      getClients(0, undefined);
    }
  };

  useEffect(() => {
    getClients(0);
  }, []);

  const validate = (data: ClientInputDTO) => {
    const newErrors: Partial<Record<keyof ClientInputDTO, string>> = {};

    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!data.email) newErrors.email = "El email no puede estar vacío";
    else if (!emailRegex.test(data.email)) newErrors.email = "Formato de email inválido";

    if (!data.username) newErrors.username = "El nombre de usuario no puede estar vacío";
    else if (data.username.length > 50) newErrors.username = "Máximo 50 caracteres";

    if (!editingId) {
      if (!data.password) newErrors.password = "La contraseña no puede estar vacía";
      else if (data.password.length < 8) newErrors.password = "Mínimo 8 caracteres";
    } else if (data.password && data.password.length < 8) {
      newErrors.password = "Mínimo 8 caracteres";
    }

    if (!data.nombre) newErrors.nombre = "El nombre no puede estar vacío";
    if (!data.apellidos) newErrors.apellidos = "Los apellidos no pueden estar vacíos";

    if (data.dni && data.dni.length !== 9) {
      newErrors.dni = "El DNI debe tener 9 caracteres";
    }

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
    setForm(emptyForm);
    setTouched({});
    setModalOpen(true);
  };

  const openEdit = (client: ClientOutputDTO) => {
    setEditingId(client.id);
    setTouched({});
    setForm({
      email: client.email,
      username: client.username,
      password: "", 
      nombre: client.nombre,
      apellidos: client.apellidos,
      dni: client.dni || "",
      fechaNacimiento: client.fechaNacimiento || "",
      favoriteGenreIds: [],
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
      await saveClient(dataToSend, editingId);
      setModalOpen(false);
    } catch {
    }
  };

  const handleDelete = async (id: number) => {
    await removeClient(id);
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
    columnHelper.accessor("nombre", {
      header: "Nombre",
      cell: (info) => (
        <span className="font-syne font-bold text-atlantis-bg-main uppercase tracking-tight">
          {info.getValue()} {info.row.original.apellidos}
        </span>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("dni", {
      header: "DNI",
      cell: (info) => (
        <span className="font-plex text-[11px] font-bold text-atlantis-secondary">
          {info.getValue() || "—"}
        </span>
      ),
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
        title="Clientes"
        subtitle={`${pagination?.totalElements ?? 0} clientes registrados`}
        onNew={openCreate}
        newLabel="Nuevo Cliente"
      />

      {apiError && (
        <div className="mb-6 px-4 py-3 border border-atlantis-error/30 bg-atlantis-error/10 font-plex text-xs text-atlantis-error uppercase tracking-widest">
          {apiError}
        </div>
      )}

      <AdminTable
        data={clients}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => getClients(page)}
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={(v) => setForm({ ...form, nombre: v })}
              onBlur={() => setTouched({ ...touched, nombre: true })}
              error={touched.nombre ? errors.nombre : undefined}
              required
            />
            <Field
              label="Apellidos"
              name="apellidos"
              value={form.apellidos}
              onChange={(v) => setForm({ ...form, apellidos: v })}
              onBlur={() => setTouched({ ...touched, apellidos: true })}
              error={touched.apellidos ? errors.apellidos : undefined}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="DNI"
              name="dni"
              value={form.dni}
              onChange={(v) => setForm({ ...form, dni: v })}
              onBlur={() => setTouched({ ...touched, dni: true })}
              error={touched.dni ? errors.dni : undefined}
            />
            <Field
              label="Fecha Nacimiento"
              name="fechaNacimiento"
              type="date"
              value={form.fechaNacimiento}
              onChange={(v) => setForm({ ...form, fechaNacimiento: v })}
            />
          </div>

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

          <div className="flex gap-3 pt-4 border-t border-atlantis-secondary/20">
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="flex-1 font-plex text-xs font-black uppercase tracking-[0.2em] bg-atlantis-bg-main text-atlantis-white py-3 hover:bg-atlantis-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear Cliente"}
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
            ¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.
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
