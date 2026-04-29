import api from "../config/api";
import type { ClientOutputDTO, PageDTO } from "../types/output.dto";
import type { ClientInputDTO } from "../types/input.dto";

export const clientService = {
  getAll: (page = 0, size = 20) =>
    api.get<PageDTO<ClientOutputDTO>>("/clientes", { params: { page, size } }).then((res) => res.data),

  getById: (id: string | number) =>
    api.get<ClientOutputDTO>(`/clientes/${id}`).then((res) => res.data),

  create: (data: ClientInputDTO) =>
    api.post<ClientOutputDTO>("/clientes", data).then((res) => res.data),

  update: (id: string | number, data: ClientInputDTO) =>
    api.put<ClientOutputDTO>(`/clientes/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/clientes/${id}`).then((res) => res.data),
};
