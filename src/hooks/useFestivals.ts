import { useState } from "react";
import { festivalService } from "../services/festival.service";
import type { FestivalInputDTO } from "../types/input.dto";

export const useFestivals = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFestivals = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await festivalService.getAll(page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar festivales");
    } finally {
      setLoading(false);
    }
  };

  const saveFestival = async (input: FestivalInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await festivalService.update(id, input);
      } else {
        await festivalService.create(input);
      }
      await getFestivals(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar festival");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFestival = async (id: number) => {
    setLoading(true);
    try {
      await festivalService.delete(id);
      await getFestivals(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar festival");
    } finally {
      setLoading(false);
    }
  };

  return {
    festivals: data?.content || [],
    pagination: data,
    loading,
    error,
    getFestivals,
    saveFestival,
    removeFestival,
  };
};
