import { useState } from "react";
import { zoneService } from "../services/zone.service";
import type { ZoneInputDTO } from "../types/input.dto";

export const useZones = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getZones = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await zoneService.getAll(page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar zonas");
    } finally {
      setLoading(false);
    }
  };

  const getZonesByFestival = async (festivalId: number, page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await zoneService.getByFestival(festivalId, page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar zonas del festival");
    } finally {
      setLoading(false);
    }
  };

  const saveZone = async (input: ZoneInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await zoneService.update(id, input);
      } else {
        await zoneService.create(input);
      }
      await getZones(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar zona");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeZone = async (id: number) => {
    setLoading(true);
    try {
      await zoneService.delete(id);
      await getZones(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar zona");
    } finally {
      setLoading(false);
    }
  };

  return {
    zones: data?.content || [],
    pagination: data,
    loading,
    error,
    getZones,
    getZonesByFestival,
    saveZone,
    removeZone,
  };
};
