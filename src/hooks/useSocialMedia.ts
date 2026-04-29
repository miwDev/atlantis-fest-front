import { useState } from "react";
import { socialMediaService } from "../services/social-media.service";
import type { SocialMediaInputDTO } from "../types/input.dto";

export const useSocialMedia = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSocialMedia = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await socialMediaService.getAll(page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar redes sociales");
    } finally {
      setLoading(false);
    }
  };

  const saveSocialMedia = async (input: SocialMediaInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await socialMediaService.update(id, input);
      } else {
        await socialMediaService.create(input);
      }
      await getSocialMedia(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar red social");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeSocialMedia = async (id: number) => {
    setLoading(true);
    try {
      await socialMediaService.delete(id);
      await getSocialMedia(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar red social");
    } finally {
      setLoading(false);
    }
  };

  return {
    socialMedia: data?.content || [],
    pagination: data,
    loading,
    error,
    getSocialMedia,
    saveSocialMedia,
    removeSocialMedia,
  };
};
