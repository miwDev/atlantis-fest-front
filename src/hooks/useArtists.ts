import { useState } from "react";
import { artistService } from "../services/artist.service";
import type { ArtistInputDTO } from "../types/input.dto";

export const useArtists = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getArtists = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await artistService.getAll(page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar artistas");
    } finally {
      setLoading(false);
    }
  };

  const saveArtist = async (input: ArtistInputDTO, id?: number, foto?: File) => {
    setLoading(true);
    try {
      let artistId = id;

      if (id) {
        // Editar: actualizar datos
        await artistService.update(id, input);
      } else {
        // Crear: primero datos, obtenemos el ID del nuevo artista
        const created = await artistService.create(input);
        artistId = created.id;
      }

      // Si hay foto, la subimos (flujo estándar: datos primero, foto después)
      if (foto && artistId) {
        await artistService.uploadFoto(artistId, foto);
      }

      await getArtists(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar artista");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeArtist = async (id: number) => {
    setLoading(true);
    try {
      await artistService.delete(id);
      await getArtists(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar artista");
    } finally {
      setLoading(false);
    }
  };

  return {
    artists: data?.content || [],
    pagination: data,
    loading,
    error,
    getArtists,
    saveArtist,
    removeArtist,
  };
};
