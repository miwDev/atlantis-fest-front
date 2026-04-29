import api from "../config/api";
import type { GenreOutputDTO, PageDTO } from "../types/output.dto";
import type { GenreInputDTO } from "../types/input.dto";

export const genreService = {
  getAll: (page = 0, size = 20) =>
    api
      .get<PageDTO<GenreOutputDTO>>("/generos", { params: { page, size } })
      .then((res) => res.data),

  getById: (id: string | number) =>
    api.get<GenreOutputDTO>(`/generos/${id}`).then((res) => res.data),

  create: (data: GenreInputDTO) =>
    api.post<GenreOutputDTO>("/generos", data).then((res) => res.data),

  update: (id: string | number, data: GenreInputDTO) =>
    api.put<GenreOutputDTO>(`/generos/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/generos/${id}`).then((res) => res.data),
};
