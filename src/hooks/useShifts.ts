import { useState } from "react";
import { shiftService } from "../services/shift.service";
import type { ShiftInputDTO } from "../types/input.dto";

export const useShifts = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getShifts = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await shiftService.getAll(page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar turnos");
    } finally {
      setLoading(false);
    }
  };

  const saveShift = async (input: ShiftInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await shiftService.update(id, input);
      } else {
        await shiftService.create(input);
      }
      await getShifts(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar turno");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeShift = async (id: number) => {
    setLoading(true);
    try {
      await shiftService.delete(id);
      await getShifts(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar turno");
    } finally {
      setLoading(false);
    }
  };

  return {
    shifts: data?.content || [],
    pagination: data,
    loading,
    error,
    getShifts,
    saveShift,
    removeShift,
  };
};
