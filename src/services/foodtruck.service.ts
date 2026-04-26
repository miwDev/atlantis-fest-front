import api from "../config/api";
import type { FoodtruckOutputDTO, PageDTO } from "../types/output.dto";
import type { FoodtruckInputDTO } from "../types/input.dto";

export const foodtruckService = {
  getAll: (page = 0, size = 20) =>
    api
      .get<PageDTO<FoodtruckOutputDTO>>("/foodtrucks", { params: { page, size } })
      .then((res) => res.data),

  getById: (id: string | number) =>
    api.get<FoodtruckOutputDTO>(`/foodtrucks/${id}`).then((res) => res.data),

  create: (data: FoodtruckInputDTO) =>
    api.post<FoodtruckOutputDTO>("/foodtrucks", data).then((res) => res.data),

  update: (id: string | number, data: FoodtruckInputDTO) =>
    api.put<FoodtruckOutputDTO>(`/foodtrucks/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/foodtrucks/${id}`).then((res) => res.data),
};
