import { InmuebleDto } from 'src/aplicacion/inmueble/consulta/dto/inmueble.dto';

export abstract class DaoInmueble {
  abstract listar(): Promise<InmuebleDto[]>;
  abstract obtenerPorId(id: number): Promise<InmuebleDto>;
}
