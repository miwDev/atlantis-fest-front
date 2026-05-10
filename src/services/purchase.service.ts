import api from "../config/api";
import type { PurchaseOutputDTO, PageDTO } from "../types/output.dto";
import type { PurchaseInputDTO } from "../types/input.dto";

export const purchaseService = {
  getAll: (page = 0, size = 5, sort?: string) =>
    api
      .get<PageDTO<PurchaseOutputDTO>>("/compras", { params: { page, size, ...(sort && { sort }) } })
      .then((res) => res.data),

  getById: (id: string | number) =>
    api.get<PurchaseOutputDTO>(`/compras/${id}`).then((res) => res.data),

  getByClientId: (clientId: string | number) =>
    api.get<PageDTO<PurchaseOutputDTO>>(`/compras/cliente/${clientId}`).then((res) => res.data),

  create: (data: PurchaseInputDTO) =>
    api.post<PurchaseOutputDTO>("/compras", data).then((res) => res.data),

  update: (id: string | number, data: PurchaseInputDTO) =>
    api.put<PurchaseOutputDTO>(`/compras/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/compras/${id}`).then((res) => res.data),
};
