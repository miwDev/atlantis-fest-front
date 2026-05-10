import api from "../config/api";
import type { ShiftOutputDTO, PageDTO } from "../types/output.dto";
import type { ShiftInputDTO } from "../types/input.dto";

export const shiftService = {
  getAll: (page = 0, size = 5, sort?: string) =>
    api
      .get<PageDTO<ShiftOutputDTO>>("/turnos", { params: { page, size, ...(sort && { sort }) } })
      .then((res) => res.data),

  getById: (id: string | number) =>
    api.get<ShiftOutputDTO>(`/turnos/${id}`).then((res) => res.data),

  create: (data: ShiftInputDTO) =>
    api.post<ShiftOutputDTO>("/turnos", data).then((res) => res.data),

  update: (id: string | number, data: ShiftInputDTO) =>
    api.put<ShiftOutputDTO>(`/turnos/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/turnos/${id}`).then((res) => res.data),
};
