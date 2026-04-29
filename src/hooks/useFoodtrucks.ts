import { useState } from "react";
import { foodtruckService } from "../services/foodtruck.service";
import type { FoodtruckInputDTO } from "../types/input.dto";

export const useFoodtrucks = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFoodtrucks = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await foodtruckService.getAll(page, size);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar foodtrucks");
    } finally {
      setLoading(false);
    }
  };

  const saveFoodtruck = async (input: FoodtruckInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await foodtruckService.update(id, input);
      } else {
        await foodtruckService.create(input);
      }
      await getFoodtrucks(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar foodtruck");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFoodtruck = async (id: number) => {
    setLoading(true);
    try {
      await foodtruckService.delete(id);
      await getFoodtrucks(data?.number || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar foodtruck");
    } finally {
      setLoading(false);
    }
  };

  return {
    foodtrucks: data?.content || [],
    pagination: data,
    loading,
    error,
    getFoodtrucks,
    saveFoodtruck,
    removeFoodtruck,
  };
};
