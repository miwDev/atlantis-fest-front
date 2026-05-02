import { useState, useMemo } from "react";
import { concertService } from "../services/concert.service";
import { festivalService } from "../services/festival.service";
import { zoneService } from "../services/zone.service";
import { artistService } from "../services/artist.service";
import type { ConcertInputDTO } from "../types/input.dto";
import type { ConcertOutputDTO, ZoneOutputDTO, ArtistOutputDTO, FestivalOutputDTO } from "../types/output.dto";

export const useConcerts = () => {
  const [concerts, setConcerts] = useState<ConcertOutputDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data for selects and validation
  const [festival, setFestival] = useState<FestivalOutputDTO | null>(null);
  const [zones, setZones] = useState<ZoneOutputDTO[]>([]);
  const [artists, setArtists] = useState<ArtistOutputDTO[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load all concerts (unpaginated or large size for grouping)
      const resConcerts = await concertService.getAll(0, 500);
      setConcerts(resConcerts.content);

      // 2. Load dependencies for the form
      if (!festival) {
        const festRes = await festivalService.getAll(0, 1);
        if (festRes.content.length > 0) {
          const currentFest = festRes.content[0];
          setFestival(currentFest);
          // 3. Load zones for this festival
          const zoneRes = await zoneService.getByFestival(currentFest.id, 0, 100);
          setZones(zoneRes.content);
        }
      }
      
      if (artists.length === 0) {
        // Load artists
        const artRes = await artistService.getAll(0, 1000);
        setArtists(artRes.content);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar datos de conciertos");
    } finally {
      setLoading(false);
    }
  };

  const saveConcert = async (input: ConcertInputDTO, id?: number) => {
    setLoading(true);
    try {
      if (id) {
        await concertService.update(id, input);
      } else {
        await concertService.create(input);
      }
      // Reload concerts after save
      const resConcerts = await concertService.getAll(0, 500);
      setConcerts(resConcerts.content);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al guardar concierto. Revisa superposición de horarios u otros errores.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeConcert = async (id: number) => {
    setLoading(true);
    try {
      await concertService.delete(id);
      const resConcerts = await concertService.getAll(0, 500);
      setConcerts(resConcerts.content);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al borrar concierto");
    } finally {
      setLoading(false);
    }
  };

  // Group and sort concerts by date and time
  const groupedConcerts = useMemo(() => {
    const groups: Record<string, ConcertOutputDTO[]> = {};
    
    // Group by date
    concerts.forEach(c => {
      if (!groups[c.fecha]) {
        groups[c.fecha] = [];
      }
      groups[c.fecha].push(c);
    });

    // Sort dates
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    // Sort concerts within each date by horaInicio then horaFin
    const result: { date: string, concerts: ConcertOutputDTO[] }[] = [];
    sortedDates.forEach(date => {
      const sortedConcerts = [...groups[date]].sort((a, b) => {
        if (a.horaInicio === b.horaInicio) {
          return a.horaFin.localeCompare(b.horaFin);
        }
        return a.horaInicio.localeCompare(b.horaInicio);
      });
      result.push({ date, concerts: sortedConcerts });
    });

    return result;
  }, [concerts]);

  return {
    groupedConcerts,
    rawConcerts: concerts, // Used for overlap validation
    festival,
    zones,
    artists,
    loading,
    error,
    loadData,
    saveConcert,
    removeConcert,
  };
};
