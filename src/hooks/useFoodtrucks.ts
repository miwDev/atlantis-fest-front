import { useState } from "react";
import { foodtruckService } from "../services/foodtruck.service";
import type { FoodtruckOutputDTO, PageDTO } from "../types/output.dto";
import type { FoodtruckInputDTO } from "../types/input.dto";

export const useFoodtrucks = () => {
  const [foodtrucks, setFoodtrucks] = useState<FoodtruckOutputDTO[]>([]);
  const [pagination, setPagination] = useState<PageDTO<FoodtruckOutputDTO> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFoodtrucks = async (page = 0) => {
    setLoading(true);
    try {
      const data = await foodtruckService.getAll(page);
      setFoodtrucks(data.content);
      setPagination(data);
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

      await getFoodtrucks(pagination?.number || 0);
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
      await getFoodtrucks(pagination?.number || 0);
    } catch (err) {
      setError("Error al eliminar el foodtruck");
    } finally {
      setLoading(false);
    }
  };

  return {
    foodtrucks,
    pagination,
    loading,
    error,
    getFoodtrucks,
    saveFoodtruck,
    removeFoodtruck,
  };
};
