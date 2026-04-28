import api from "../config/api";
import type { TicketTypeOutputDTO, PageDTO } from "../types/output.dto";
import type { TicketTypeInputDTO } from "../types/input.dto";

export const ticketTypeService = {
  getAll: (page = 0, size = 20) =>
    api
      .get<PageDTO<TicketTypeOutputDTO>>("/tipos-ticket", { params: { page, size } })
      .then((res) => res.data),

  getById: (id: string | number) =>
    api.get<TicketTypeOutputDTO>(`/tipos-ticket/${id}`).then((res) => res.data),

  create: (data: TicketTypeInputDTO) =>
    api.post<TicketTypeOutputDTO>("/tipos-ticket", data).then((res) => res.data),

  update: (id: string | number, data: TicketTypeInputDTO) =>
    api.put<TicketTypeOutputDTO>(`/tipos-ticket/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/tipos-ticket/${id}`).then((res) => res.data),
};
