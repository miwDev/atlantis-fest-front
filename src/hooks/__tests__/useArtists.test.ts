import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useArtists } from "../useArtists";
import { artistService } from "../../services/artist.service";

// Mock del servicio
vi.mock("../../services/artist.service", () => ({
  artistService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    uploadFoto: vi.fn(),
  },
}));

describe("useArtists hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch artists and update state", async () => {
    const mockData = {
      content: [{ id: 1, nombreArtistico: "Artist 1" }],
      number: 0,
      totalElements: 1,
    };
    (artistService.getAll as any).mockResolvedValue(mockData);

    const { result } = renderHook(() => useArtists());

    // Inicialmente cargando es falso hasta que llamemos a getArtists
    expect(result.current.loading).toBe(false);

    // Ejecutamos getArtists
    result.current.getArtists();

    // Verificamos que pase a estado cargando
    // (Nota: renderHook se actualiza, pero a veces es muy rápido)
    
    await waitFor(() => {
      expect(result.current.artists).toEqual(mockData.content);
      expect(result.current.loading).toBe(false);
    });

    expect(artistService.getAll).toHaveBeenCalledWith(0, 5, undefined);
  });

  it("should handle errors when fetching artists", async () => {
    const errorMessage = "Network Error";
    (artistService.getAll as any).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useArtists());

    result.current.getArtists();

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });
});
