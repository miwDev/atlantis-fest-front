export interface ArtistOutputDTO {
  id: number;
  email: string;
  username: string;
  artistName: string;
  name: string;
  surname: string;
  biography?: string;
  genres?: string[];
  fotoUrl?: string;
}

export interface ClientOutputDTO {
  id: number;
  email: string;
  username: string;
  nombre: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  favoriteGenres: string[];
}

export interface ConcertOutputDTO {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracionEstimada?: number;
  artistName: string;
  zoneName: string;
}

export interface FestivalOutputDTO {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  ubicacionGeneral?: string;
  logoUrl?: string;
}

export interface FoodtruckOutputDTO {
  id: number;
  email: string;
  username: string;
  nombre: string;
  menuPdfUrl?: string;
  tipoComida: string;
  imagenPortadaUrl?: string;
  estaAbierto?: boolean;
  latitudActual?: number;
  longitudActual?: number;
  zoneNombre?: string;
}

export interface GenreOutputDTO {
  id: number;
  nombre: string;
}

export interface InvoiceOutputDTO {
  id: number;
  numeroFactura: string;
  fechaEmision: string;
  datosFiscales: string;
  paymentId: number;
}

export interface PurchaseOutputDTO {
  id: number;
  fechaCompra: string;
  precioFinal: number;
  descuentoAplicado?: number;
  clientUsername: string;
  ticketTipo: string;
}

export interface ReviewOutputDTO {
  id: number;
  targetType: string;
  targetId: number;
  stars: number;
  comment?: string;
  clientUsername: string;
}

export interface ShiftOutputDTO {
  id: number;
  horaInicio: string;
  horaFin: string;
  descripcionTarea?: string;
  staffUsername: string;
  zoneNombre: string;
}

export interface SocialMediaOutputDTO {
  id: number;
  tipo: string;
  url: string;
  artistName: string;
}

export interface StaffOutputDTO {
  id: number;
  email: string;
  username: string;
}

export interface TicketTypeOutputDTO {
  id: number;
  tipo: string;
  precioBase: number;
  descripcion?: string;
  maxDisponible: number;
  festivalNombre: string;
}

export interface ZoneOutputDTO {
  id: number;
  nombre: string;
  descripcion?: string;
  tipo: string;
  latitud?: number;
  longitud?: number;
  festivalNombre: string;
}

export interface PageDTO<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
