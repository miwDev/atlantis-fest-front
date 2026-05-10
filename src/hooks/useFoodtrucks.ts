import { useState } from "react";
import { foodtruckService } from "../services/foodtruck.service";
import type { FoodtruckOutputDTO, PageDTO } from "../types/output.dto";
import type { FoodtruckInputDTO } from "../types/input.dto";
import { zoneService } from "../services/zone.service";
import type { ZoneOutputDTO } from "../types/output.dto";

export const useFoodtrucks = () => {
  const [foodtrucks, setFoodtrucks] = useState<FoodtruckOutputDTO[]>([]);
  const [pagination, setPagination] = useState<PageDTO<FoodtruckOutputDTO> | null>(null);
  const [foodtruckZones, setFoodtruckZones] = useState<ZoneOutputDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortString, setSortString] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const getFoodtrucks = async (page: number = 0, sort: string | undefined = sortString) => {
    if (sort !== sortString) setSortString(sort);
    setLoading(true);
    try {
      const data = await foodtruckService.getAll(page, 5, sort);
      setFoodtrucks(data.content);
      setPagination(data);

      if (foodtruckZones.length === 0) {
        // Obtenemos zonas y filtramos solo las de tipo FOODTRUCK
        const zonesRes = await zoneService.getAll(0, 100);
        setFoodtruckZones(zonesRes.content.filter(z => z.tipo === 'FOODTRUCK'));
      }
    } catch (err) {
      setError("Error al cargar los foodtrucks");
    } finally {
      setLoading(false);
    }
  };

  const saveFoodtruck = async (input: FoodtruckInputDTO, id?: number, foto?: File, menuPdf?: File) => {
    setLoading(true);
    try {
      let foodtruckId = id;

      if (id) {
        await foodtruckService.update(id, input);
      } else {
        const created = await foodtruckService.create(input);
        foodtruckId = created.id;
      }

      // Subir foto si se seleccionó una
      if (foto && foodtruckId) {
        await foodtruckService.uploadFoto(foodtruckId, foto);
      }

      // Subir menú PDF si se seleccionó uno
      if (menuPdf && foodtruckId) {
        await foodtruckService.uploadMenuPdf(foodtruckId, menuPdf);
      }

      await getFoodtrucks(pagination?.number || 0, sortString);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar el foodtruck");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFoodtruck = async (id: number) => {
    setLoading(true);
    try {
      await foodtruckService.delete(id);
      await getFoodtrucks(pagination?.number || 0, sortString);
    } catch (err) {
      setError("Error al eliminar el foodtruck");
    } finally {
      setLoading(false);
    }
  };

  return {
    foodtrucks,
    pagination,
    foodtruckZones,
    loading,
    error,
    getFoodtrucks,
    saveFoodtruck,
    removeFoodtruck,
  };
};
