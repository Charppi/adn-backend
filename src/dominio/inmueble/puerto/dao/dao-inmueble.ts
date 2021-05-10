import { InmuebleDto } from 'src/aplicacion/inmueble/consulta/dto/inmueble.dto';

export abstract class DaoInmueble {
  abstract listar(limit: number, offset: number): Promise<InmuebleDto[]>;
  abstract obtenerInmueblePorId(id: number): Promise<InmuebleDto>;
  abstract existeDireccionInmueble(direccion: string): Promise<boolean>;
  abstract existeInmueble(id: number): Promise<boolean>;
  abstract totalInmuebles(): Promise<number>;

}
