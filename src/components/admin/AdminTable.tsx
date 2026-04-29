import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

interface AdminTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  loading?: boolean;
  pagination?: any;
  onPageChange?: (page: number) => void;
}

export function AdminTable<T>({
  data,
  columns,
  loading,
  pagination,
  onPageChange,
}: AdminTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 border border-atlantis-secondary/20">
        <span className="font-plex text-[10px] uppercase tracking-[0.3em] text-atlantis-secondary animate-pulse">
          Cargando datos...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="overflow-x-auto border border-atlantis-secondary/20">
        <table className="w-full">
          <thead className="bg-atlantis-bg-main">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left font-plex text-[10px] font-black uppercase tracking-[0.2em] text-atlantis-white"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center font-plex text-[10px] uppercase tracking-[0.2em] text-atlantis-secondary"
                >
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-atlantis-secondary/10 hover:bg-atlantis-secondary/5 transition-colors duration-200 ${
                    i % 2 === 0 ? "bg-atlantis-white" : "bg-atlantis-white/60"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 font-plex text-xs text-atlantis-bg-main"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && onPageChange && (
        <div className="flex items-center justify-between pt-2">
          <span className="font-plex text-[10px] text-atlantis-secondary uppercase tracking-widest">
            {pagination.totalElements} registros · Página {(pagination.number ?? 0) + 1} de {pagination.totalPages ?? 1}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange((pagination.number ?? 0) - 1)}
              disabled={pagination.first}
              className="font-plex text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 border border-atlantis-bg-main text-atlantis-bg-main hover:bg-atlantis-bg-main hover:text-atlantis-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <button
              onClick={() => onPageChange((pagination.number ?? 0) + 1)}
              disabled={pagination.last}
              className="font-plex text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 border border-atlantis-bg-main text-atlantis-bg-main hover:bg-atlantis-bg-main hover:text-atlantis-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
