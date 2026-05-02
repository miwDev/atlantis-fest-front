export interface ArtistInputDTO {
  email: string;
  username: string;
  password?: string;
  name: string;
  surname: string;
  artistName: string;
  biography?: string;
  genreIds?: number[];
}

export interface ClientInputDTO {
  email: string;
  username: string;
  password?: string;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  favoriteGenreIds: number[];
}

export interface ConcertInputDTO {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracionEstimada?: number;
  artistId: number;
  zoneId: number;
}

export interface FestivalInputDTO {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  ubicacionGeneral?: string;
  logoUrl?: string;
}

export interface FoodtruckInputDTO {
  email: string;
  username: string;
  password?: string;
  nombre: string;
  tipoComida: string;
  zoneId?: number;
}

export interface GenreInputDTO {
  nombre: string;
}

export interface InvoiceInputDTO {
  paymentId: number;
  datosFiscales: string;
}

export interface PurchaseInputDTO {
  clientId: number;
  ticketTypeId: number;
  descuentoAplicado?: number;
}

export interface ReviewInputDTO {
  targetType: string;
  targetId: number;
  stars: number;
  comment?: string;
}

export interface ShiftInputDTO {
  horaInicio: string;
  horaFin: string;
  descripcionTarea?: string;
  staffId: number;
  zoneId: number;
}

export interface SocialMediaInputDTO {
  tipo: string;
  url: string;
  artistId: number;
}

export interface StaffInputDTO {
  email: string;
  username: string;
  password?: string;
}

export interface TicketTypeInputDTO {
  tipo: string;
  precioBase: number;
  descripcion?: string;
  maxDisponible: number;
  festivalId: number;
}

export interface ZoneInputDTO {
  nombre: string;
  descripcion?: string;
  tipo?: string;
  latitud?: number;
  longitud?: number;
  festivalId: number;
}
