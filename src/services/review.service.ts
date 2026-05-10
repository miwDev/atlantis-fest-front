import api from "../config/api";
import type { ReviewOutputDTO, PageDTO } from "../types/output.dto";
import type { ReviewInputDTO } from "../types/input.dto";

export const reviewService = {
  getAll: (page = 0, size = 5, sort?: string) =>
    api
      .get<PageDTO<ReviewOutputDTO>>("/resenas", { params: { page, size, ...(sort && { sort }) } })
      .then((res) => res.data),

  getById: (id: string | number) =>
    api.get<ReviewOutputDTO>(`/resenas/${id}`).then((res) => res.data),

  create: (data: ReviewInputDTO) =>
    api.post<ReviewOutputDTO>("/resenas", data).then((res) => res.data),

  update: (id: string | number, data: ReviewInputDTO) =>
    api.put<ReviewOutputDTO>(`/resenas/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/resenas/${id}`).then((res) => res.data),
};
