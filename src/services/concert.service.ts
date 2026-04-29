import api from "../config/api";
import type { ConcertOutputDTO, PageDTO } from "../types/output.dto";
import type { ConcertInputDTO } from "../types/input.dto";

export const concertService = {
  getAll: (page = 0, size = 20) =>
    api
      .get<PageDTO<ConcertOutputDTO>>("/conciertos", { params: { page, size } })
      .then((res) => res.data),

  getById: (id: string | number) =>
    api.get<ConcertOutputDTO>(`/conciertos/${id}`).then((res) => res.data),

  create: (data: ConcertInputDTO) =>
    api.post<ConcertOutputDTO>("/conciertos", data).then((res) => res.data),

  update: (id: string | number, data: ConcertInputDTO) =>
    api.put<ConcertOutputDTO>(`/conciertos/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/conciertos/${id}`).then((res) => res.data),

  getByArtist: (artistId: string | number, page = 0, size = 20) =>
    api
      .get<PageDTO<ConcertOutputDTO>>(`/conciertos/artista/${artistId}`, { params: { page, size } })
      .then((res) => res.data),
};
