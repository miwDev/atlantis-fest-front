import api from "../config/api";
import type { StaffOutputDTO, PageDTO } from "../types/output.dto";
import type { StaffInputDTO } from "../types/input.dto";

export const staffService = {
  getAll: (page = 0, size = 5, sort?: string) =>
    api.get<PageDTO<StaffOutputDTO>>("/staffs", { params: { page, size, ...(sort && { sort }) } }).then((res) => res.data),

  getById: (id: string | number) =>
    api.get<StaffOutputDTO>(`/staffs/${id}`).then((res) => res.data),

  create: (data: StaffInputDTO) =>
    api.post<StaffOutputDTO>("/staffs", data).then((res) => res.data),

  update: (id: string | number, data: StaffInputDTO) =>
    api.put<StaffOutputDTO>(`/staffs/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/staffs/${id}`).then((res) => res.data),
};
