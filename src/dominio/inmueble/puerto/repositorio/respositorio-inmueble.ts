import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { Inmueble } from '../../modelo/inmueble';

export abstract class RepositorioInmueble {
  abstract guardar(inmueble: Inmueble): Promise<void>;
  abstract editar(inmueble: Inmueble): Promise<void>
  abstract asignarInmueble(inmuebleId: number, usuario: number): Promise<void>
  abstract actualizarFechasDePago(id: number, fechaInicioPago: Date, fechaLimitePago: Date): Promise<void>
}