import { useState } from "react";
import { festivalService } from "../services/festival.service";
import { zoneService } from "../services/zone.service";
import { ticketTypeService } from "../services/ticket-type.service";
import type { FestivalInputDTO } from "../types/input.dto";
import type { FestivalOutputDTO, ZoneOutputDTO, TicketTypeSalesOutputDTO, PageDTO } from "../types/output.dto";



export const useFestivals = () => {
  const [data, setData] = useState<PageDTO<FestivalOutputDTO> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States specific to the dashboard view
  const [currentFestival, setCurrentFestival] = useState<FestivalOutputDTO | null>(null);
  const [zones, setZones] = useState<ZoneOutputDTO[]>([]);
  const [sales, setSales] = useState<TicketTypeSalesOutputDTO[]>([]);

  const getFestivals = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await festivalService.getAll(page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar festivales");
    } finally {
      setLoading(false);
    }
  };

  const saveFestival = async (input: FestivalInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        const updated = await festivalService.update(id, input);
        if (currentFestival?.id === id) {
          setCurrentFestival(updated);
        }
      } else {
        await festivalService.create(input);
      }
      await getFestivals(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar festival");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFestival = async (id: number) => {
    setLoading(true);
    try {
      await festivalService.delete(id);
      await getFestivals(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar festival");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Obtener festivales y usar el primero por defecto
      const festivalsPage = await festivalService.getAll(0, 1);
      if (festivalsPage.content.length === 0) {
        setLoading(false);
        return; // No hay festivales
      }
      
      const festival = festivalsPage.content[0];
      setCurrentFestival(festival);

      // 2. Obtener zonas del festival
      const zonesPage = await zoneService.getByFestival(festival.id, 0, 100);
      setZones(zonesPage.content);

      // 3. Obtener tickets del festival
      const ticketsPage = await ticketTypeService.getByFestival(festival.id, 0, 100);
      
      // 4. Obtener resumen de ventas para cada ticket
      const salesPromises = ticketsPage.content.map(async (ticket) => {
        try {
          return await ticketTypeService.getSalesSummary(ticket.id);
        } catch (e) {
          // Si el endpoint falla o no está implementado aún, devolvemos mock
          return {
            ticketTypeId: ticket.id,
            tipo: ticket.tipo,
            precioBase: ticket.precioBase,
            vendidos: 0,
            disponibles: ticket.maxDisponible,
            ingresoTotal: 0
          };
        }
      });
      
      const salesData = await Promise.all(salesPromises);
      setSales(salesData);
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar el panel del festival");
    } finally {
      setLoading(false);
    }
  };

  return {
    festivals: data?.content || [],
    pagination: data,
    loading,
    error,
    getFestivals,
    saveFestival,
    removeFestival,
    // Dashboard specific exports
    currentFestival,
    zones,
    sales,
    loadDashboard
  };
};
