import api from "../config/api";
import type { InvoiceOutputDTO, PageDTO } from "../types/output.dto";
import type { InvoiceInputDTO } from "../types/input.dto";

export const invoiceService = {
  getAll: (page = 0, size = 5, sort?: string) =>
    api
      .get<PageDTO<InvoiceOutputDTO>>("/facturas", { params: { page, size, ...(sort && { sort }) } })
      .then((res) => res.data),

  getById: (id: string | number) =>
    api.get<InvoiceOutputDTO>(`/facturas/${id}`).then((res) => res.data),

  create: (data: InvoiceInputDTO) =>
    api.post<InvoiceOutputDTO>("/facturas", data).then((res) => res.data),

  update: (id: string | number, data: InvoiceInputDTO) =>
    api.put<InvoiceOutputDTO>(`/facturas/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/facturas/${id}`).then((res) => res.data),
};
