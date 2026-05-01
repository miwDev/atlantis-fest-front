import { useState } from "react";
import { staffService } from "../services/staff.service";
import type { StaffOutputDTO, PageDTO } from "../types/output.dto";
import type { StaffInputDTO } from "../types/input.dto";

export const useStaff = () => {
  const [staffList, setStaffList] = useState<StaffOutputDTO[]>([]);
  const [pagination, setPagination] = useState<PageDTO<StaffOutputDTO> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStaff = async (page = 0) => {
    setLoading(true);
    try {
      const data = await staffService.getAll(page);
      setStaffList(data.content);
      setPagination(data);
    } catch (err) {
      setError("Error al cargar el staff");
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
      await getStaff(pagination?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar el staff");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeStaff = async (id: number) => {
    setLoading(true);
    try {
      await staffService.delete(id);
      await getStaff(pagination?.number || 0);
    } catch (err) {
      setError("Error al eliminar el staff");
    } finally {
      setLoading(false);
    }
  };

  return {
    staffList,
    pagination,
    loading,
    error,
    getStaff,
    saveStaff,
    removeStaff,
  };
};
