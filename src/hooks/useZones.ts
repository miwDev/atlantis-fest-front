import { useState } from "react";
import { zoneService } from "../services/zone.service";
import type { ZoneInputDTO } from "../types/input.dto";
import type { ZoneOutputDTO, PageDTO } from "../types/output.dto";

export const useZones = () => {
  const [data, setData] = useState<PageDTO<ZoneOutputDTO> | null>(null);
  const [tipos, setTipos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortString, setSortString] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const getZones = async (page: number = 0, sort: string | undefined = sortString) => {
    if (sort !== sortString) setSortString(sort);
    setLoading(true);
    try {
      const res = await zoneService.getAll(page, 5, sort);
      setData(res);
      
      if (tipos.length === 0) {
        const tiposRes = await zoneService.getTipos();
        setTipos(tiposRes);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar zonas");
    } finally {
      setLoading(false);
    }
  };

  const getZonesByFestival = async (festivalId: number, page = 0, sort = sortString) => {
    if (sort !== sortString) setSortString(sort);
    setLoading(true);
    try {
      const res = await zoneService.getByFestival(festivalId, page, 5, sort);
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
      await getZones(data?.number || 0, sortString);
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
      await getZones(data?.number || 0, sortString);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar zona");
    } finally {
      setLoading(false);
    }
  };

  return {
    sortString,
    zones: data?.content || [],
    pagination: data,
    tipos,
    loading,
    error,
    getZones,
    getZonesByFestival,
    saveZone,
    removeZone,
  };
};
