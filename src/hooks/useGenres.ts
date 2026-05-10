import { useState } from "react";
import { genreService } from "../services/genre.service";
import type { GenreInputDTO } from "../types/input.dto";

export const useGenres = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sortString, setSortString] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const getGenres = async (page: number = 0, sort: string | undefined = sortString) => {
    if (sort !== sortString) setSortString(sort);
    setLoading(true);
    try {
      const res = await genreService.getAll(page, 5, sort);
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
      await getGenres(data?.number || 0, sortString);
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
      await getGenres(data?.number || 0, sortString);
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
