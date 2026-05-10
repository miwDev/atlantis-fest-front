import { useState } from "react";
import { ticketTypeService } from "../services/ticket-type.service";
import type { TicketTypeInputDTO } from "../types/input.dto";
import type { TicketTypeOutputDTO, PageDTO } from "../types/output.dto";

export const useTickets = () => {
  const [data, setData] = useState<PageDTO<TicketTypeOutputDTO> | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortString, setSortString] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const getTickets = async (page: number = 0, sort: string | undefined = sortString) => {
    if (sort !== sortString) setSortString(sort);
    setLoading(true);
    try {
      const res = await ticketTypeService.getAll(page, 5, sort);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar tickets");
    } finally {
      setLoading(false);
    }
  };

  const saveTicket = async (input: TicketTypeInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await ticketTypeService.update(id, input);
      } else {
        await ticketTypeService.create(input);
      }
      await getTickets(data?.number || 0, sortString);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar ticket");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTicket = async (id: number) => {
    setLoading(true);
    try {
      await ticketTypeService.delete(id);
      await getTickets(data?.number || 0, sortString);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar ticket");
    } finally {
      setLoading(false);
    }
  };

  return {
    tickets: data?.content || [],
    pagination: data,
    loading,
    error,
    getTickets,
    saveTicket,
    removeTicket,
  };
};
