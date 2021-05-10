import { Inmueble } from '../../modelo/inmueble';

export abstract class RepositorioInmueble {
  abstract guardar(inmueble: Inmueble): Promise<void>;
  abstract editar(inmueble: Inmueble): Promise<void>;
  abstract asignarInmueble(inmuebleId: number,
    usuario: number | null,
    fechaAsignacion: Date | null,
    fechaInicioPago: Date | null,
    fechaLimitePago: Date | null): Promise<void>;
  abstract actualizarFechasDePago(id: number, fechaInicioPago: Date, fechaLimitePago: Date): Promise<void>;
}