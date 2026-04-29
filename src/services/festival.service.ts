import api from "../config/api";
import type { FestivalOutputDTO, PageDTO } from "../types/output.dto";
import type { FestivalInputDTO } from "../types/input.dto";

export const festivalService = {
  getAll: (page = 0, size = 20) =>
    api
      .get<PageDTO<FestivalOutputDTO>>("/festivales", { params: { page, size } })
      .then((res) => res.data),

  getById: (id: string | number) =>
    api.get<FestivalOutputDTO>(`/festivales/${id}`).then((res) => res.data),

  create: (data: FestivalInputDTO) =>
    api.post<FestivalOutputDTO>("/festivales", data).then((res) => res.data),

  update: (id: string | number, data: FestivalInputDTO) =>
    api.put<FestivalOutputDTO>(`/festivales/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/festivales/${id}`).then((res) => res.data),
};
