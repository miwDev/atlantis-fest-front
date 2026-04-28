import { useState, useCallback } from "react";
import { artistService } from "../services/artist.service";
import type { ArtistOutputDTO, PageDTO } from "../types/output.dto";
import type { ArtistInputDTO } from "../types/input.dto";

export const useArtists = () => {
  const [artists, setArtists] = useState<ArtistOutputDTO[]>([]);
  const [pagination, setPagination] = useState<Omit<
    PageDTO<ArtistOutputDTO>,
    "content"
  > | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtists = useCallback(async (page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const data = await artistService.getAll(page, size);
      setArtists(data.content);
      // Guardamos la info de paginación sin desestructurar 'content'
      const pageInfo: Omit<PageDTO<ArtistOutputDTO>, "content"> = {
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        size: data.size,
        number: data.number,
        first: data.first,
        last: data.last,
        numberOfElements: data.numberOfElements,
        empty: data.empty,
      };
      setPagination(pageInfo);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Error al cargar los artistas");
    } finally {
      setLoading(false);
    }
  }, []);

  const createArtist = async (data: ArtistInputDTO) => {
    setLoading(true);
    try {
      const newArtist = await artistService.create(data);
      setArtists((prev) => [newArtist, ...prev]);
      return newArtist;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Error al crear el artista");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateArtist = async (id: number, data: ArtistInputDTO) => {
    setLoading(true);
    try {
      const updated = await artistService.update(id, data);
      setArtists((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message || "Error al actualizar el artista",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteArtist = async (id: number) => {
    setLoading(true);
    try {
      await artistService.delete(id);
      setArtists((prev) => prev.filter((a) => a.id !== id));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Error al eliminar el artista");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    artists,
    pagination,
    loading,
    error,
    fetchArtists,
    createArtist,
    updateArtist,
    deleteArtist,
  };
};
