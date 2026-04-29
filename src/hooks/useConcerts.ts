import { useState } from "react";
import { concertService } from "../services/concert.service";
import type { ConcertInputDTO } from "../types/input.dto";

export const useConcerts = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConcerts = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await concertService.getAll(page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar conciertos");
    } finally {
      setLoading(false);
    }
  };

  const getConcertsByArtist = async (artistId: number, page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await concertService.getByArtist(artistId, page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar conciertos del artista");
    } finally {
      setLoading(false);
    }
  };

  const saveConcert = async (input: ConcertInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await concertService.update(id, input);
      } else {
        await concertService.create(input);
      }
      await getConcerts(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar concierto");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeConcert = async (id: number) => {
    setLoading(true);
    try {
      await concertService.delete(id);
      await getConcerts(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar concierto");
    } finally {
      setLoading(false);
    }
  };

  return {
    concerts: data?.content || [],
    pagination: data,
    loading,
    error,
    getConcerts,
    getConcertsByArtist,
    saveConcert,
    removeConcert,
  };
};
