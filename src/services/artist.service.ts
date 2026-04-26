import api from "../config/api";
import type { ArtistOutputDTO } from "../types/output.dto";
import type { ArtistInputDTO } from "../types/input.dto";

export const artistService = {
  getAll: () => api.get<ArtistOutputDTO[]>("/artistas").then((res) => res.data),

  getById: (id: string | number) =>
    api.get<ArtistOutputDTO>(`/artistas/${id}`).then((res) => res.data),

  create: (data: ArtistInputDTO) =>
    api.post<ArtistOutputDTO>("/artistas", data).then((res) => res.data),

  update: (id: string | number, data: ArtistInputDTO) =>
    api.put<ArtistOutputDTO>(`/artistas/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/artistas/${id}`).then((res) => res.data),
};
