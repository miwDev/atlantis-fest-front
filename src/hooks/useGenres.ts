import { useState } from "react";
import { genreService } from "../services/genre.service";
import type { GenreInputDTO } from "../types/input.dto";

export const useGenres = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGenres = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await genreService.getAll(page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar géneros");
    } finally {
      setLoading(false);
    }
  };

  const saveGenre = async (input: GenreInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await genreService.update(id, input);
      } else {
        await genreService.create(input);
      }
      await getGenres(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar género");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeGenre = async (id: number) => {
    setLoading(true);
    try {
      await genreService.delete(id);
      await getGenres(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar género");
    } finally {
      setLoading(false);
    }
  };

  return {
    genres: data?.content || [],
    pagination: data,
    loading,
    error,
    getGenres,
    saveGenre,
    removeGenre,
  };
};
