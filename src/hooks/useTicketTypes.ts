import { useState } from "react";
import { ticketTypeService } from "../services/ticket-type.service";
import type { TicketTypeInputDTO } from "../types/input.dto";

export const useTicketTypes = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sortString, setSortString] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const getTicketTypes = async (page: number = 0, sort: string | undefined = sortString) => {
    if (sort !== sortString) setSortString(sort);
    setLoading(true);
    try {
      const res = await ticketTypeService.getAll(page, 5, sort);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar tipos de ticket");
    } finally {
      setLoading(false);
    }
  };

  const saveTicketType = async (input: TicketTypeInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await ticketTypeService.update(id, input);
      } else {
        await ticketTypeService.create(input);
      }
      await getTicketTypes(data?.number || 0, sortString);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar tipo de ticket");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTicketType = async (id: number) => {
    setLoading(true);
    try {
      await ticketTypeService.delete(id);
      await getTicketTypes(data?.number || 0, sortString);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar tipo de ticket");
    } finally {
      setLoading(false);
    }
  };

  return {
    ticketTypes: data?.content || [],
    pagination: data,
    loading,
    error,
    getTicketTypes,
    saveTicketType,
    removeTicketType,
  };
};
