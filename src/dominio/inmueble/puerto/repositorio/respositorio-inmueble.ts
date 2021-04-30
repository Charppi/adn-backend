import { InmuebleEntidad } from 'src/infraestructura/inmueble/entidad/inmueble.entidad';
import { Inmueble } from '../../modelo/inmueble';

export abstract class RepositorioInmueble {
  abstract existeDireccionInmueble(direccion: string): Promise<boolean>;
  abstract existeInmueble(id: number): Promise<boolean>;
  abstract obtenerInmueblePorId(id: number): Promise<InmuebleEntidad>
  abstract guardar(inmueble: Inmueble): Promise<void>;
  abstract editar(inmueble: Inmueble): Promise<void>
  abstract actualizarDatosDePago(inmueble: InmuebleEntidad): Promise<void>
}