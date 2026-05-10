import { useState } from "react";
import { reviewService } from "../services/review.service";
import type { ReviewInputDTO } from "../types/input.dto";

export const useReviews = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sortString, setSortString] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const getReviews = async (page: number = 0, sort: string | undefined = sortString) => {
    if (sort !== sortString) setSortString(sort);
    setLoading(true);
    try {
      const res = await reviewService.getAll(page, 5, sort);
      setData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar reseñas");
    } finally {
      setLoading(false);
    }
  };

  const saveReview = async (input: ReviewInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await reviewService.update(id, input);
      } else {
        await reviewService.create(input);
      }
      await getReviews(data?.number || 0, sortString);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar reseña");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeReview = async (id: number) => {
    setLoading(true);
    try {
      await reviewService.delete(id);
      await getReviews(data?.number || 0, sortString);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar reseña");
    } finally {
      setLoading(false);
    }
  };

  return {
    reviews: data?.content || [],
    pagination: data,
    loading,
    error,
    getReviews,
    saveReview,
    removeReview,
  };
};
