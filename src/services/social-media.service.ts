import api from "../config/api";
import type { SocialMediaOutputDTO, PageDTO } from "../types/output.dto";
import type { SocialMediaInputDTO } from "../types/input.dto";

export const socialMediaService = {
  getAll: (page = 0, size = 5, sort?: string) =>
    api
      .get<PageDTO<SocialMediaOutputDTO>>("/redes-sociales", { params: { page, size, ...(sort && { sort }) } })
      .then((res) => res.data),

  getById: (id: string | number) =>
    api.get<SocialMediaOutputDTO>(`/redes-sociales/${id}`).then((res) => res.data),

  create: (data: SocialMediaInputDTO) =>
    api.post<SocialMediaOutputDTO>("/redes-sociales", data).then((res) => res.data),

  update: (id: string | number, data: SocialMediaInputDTO) =>
    api.put<SocialMediaOutputDTO>(`/redes-sociales/${id}`, data).then((res) => res.data),

  delete: (id: string | number) =>
    api.delete(`/redes-sociales/${id}`).then((res) => res.data),
};
