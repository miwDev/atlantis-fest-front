import { useState } from "react";
import { clientService } from "../services/client.service";
import type { ClientOutputDTO, PageDTO } from "../types/output.dto";
import type { ClientInputDTO } from "../types/input.dto";

export const useClients = () => {
  const [clients, setClients] = useState<ClientOutputDTO[]>([]);
  const [pagination, setPagination] = useState<PageDTO<ClientOutputDTO> | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortString, setSortString] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const getClients = async (page: number = 0, sort: string | undefined = sortString) => {
    if (sort !== sortString) setSortString(sort);
    setLoading(true);
    try {
      const data = await clientService.getAll(page, 5, sort);
      setClients(data.content);
      setPagination(data);
    } catch (err) {
      setError("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  const saveClient = async (input: ClientInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await clientService.update(id, input);
      } else {
        await clientService.create(input);
      }
      await getClients(pagination?.number || 0, sortString);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar el cliente");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeClient = async (id: number) => {
    setLoading(true);
    try {
      await clientService.delete(id);
      await getClients(pagination?.number || 0, sortString);
    } catch (err) {
      setError("Error al eliminar el cliente");
    } finally {
      setLoading(false);
    }
  };

  return {
    clients,
    pagination,
    loading,
    error,
    getClients,
    saveClient,
    removeClient,
  };
};
