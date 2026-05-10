import api from "../config/api";
import type { ZoneOutputDTO, PageDTO } from "../types/output.dto";
import type { ZoneInputDTO } from "../types/input.dto";

export const zoneService = {
  getAll: (page = 0, size = 5, sort?: string) =>
    api
      .get<PageDTO<ZoneOutputDTO>>("/zonas", { params: { page, size, ...(sort && { sort }) } })
      .then((res) => res.data),

  getById: (id: string | number) =>
    api.get<ZoneOutputDTO>(`/zonas/${id}`).then((res) => res.data),

  create: (data: ZoneInputDTO) =>
    api.post<ZoneOutputDTO>("/zonas", data).then((res) => res.data),

  update: (id: string | number, data: ZoneInputDTO) =>
    api.put<ZoneOutputDTO>(`/zonas/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/zonas/${id}`).then((res) => res.data),

  getByFestival: (festivalId: string | number, page = 0, size = 5, sort?: string) =>
    api
      .get<PageDTO<ZoneOutputDTO>>(`/zonas/festival/${festivalId}`, { params: { page, size, ...(sort && { sort }) } })
      .then((res) => res.data),

  getTipos: () => api.get<string[]>("/zonas/tipos").then((res) => res.data),
};
