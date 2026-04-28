import { useState } from "react";
import { staffService } from "../services/staff.service";
import type { StaffInputDTO } from "../types/input.dto";

export const useStaff = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStaff = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await staffService.getAll(page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar staff");
    } finally {
      setLoading(false);
    }
  };

  const saveStaff = async (input: StaffInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await staffService.update(id, input);
      } else {
        await staffService.create(input);
      }
      await getStaff(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar staff");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeStaff = async (id: number) => {
    setLoading(true);
    try {
      await staffService.delete(id);
      await getStaff(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar staff");
    } finally {
      setLoading(false);
    }
  };

  return {
    staffList: data?.content || [],
    pagination: data,
    loading,
    error,
    getStaff,
    saveStaff,
    removeStaff,
  };
};
