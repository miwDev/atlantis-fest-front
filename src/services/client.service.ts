import api from "../config/api";
import type { ClientInputDTO } from "../types/input.dto";
import type { ClientOutputDTO, PageDTO } from "../types/output.dto";

export const clientService = {
  getAll: async (page = 0, size = 20) => {
    const { data } = await api.get<PageDTO<ClientOutputDTO>>(`/clientes?page=${page}&size=${size}`);
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<ClientOutputDTO>(`/clientes/${id}`);
    return data;
  },

  create: async (client: ClientInputDTO) => {
    const { data } = await api.post<ClientOutputDTO>("/clientes", client);
    return data;
  },

  update: async (id: number, client: ClientInputDTO) => {
    const { data } = await api.put<ClientOutputDTO>(`/clientes/${id}`, client);
    return data;
  },

  delete: async (id: number) => {
    await api.delete(`/clientes/${id}`);
  },
};
