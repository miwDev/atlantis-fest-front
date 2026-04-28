import { useState } from "react";
import { clientService } from "../services/client.service";
import type { ClientInputDTO } from "../types/input.dto";

export const useClients = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getClients = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await clientService.getAll(page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar clientes");
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
      await getClients(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar cliente");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeClient = async (id: number) => {
    setLoading(true);
    try {
      await clientService.delete(id);
      await getClients(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar cliente");
    } finally {
      setLoading(false);
    }
  };

  return {
    clients: data?.content || [],
    pagination: data,
    loading,
    error,
    getClients,
    saveClient,
    removeClient,
  };
};
