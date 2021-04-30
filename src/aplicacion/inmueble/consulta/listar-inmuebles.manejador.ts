import { Injectable } from '@nestjs/common';
import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { InmuebleDto } from './dto/inmueble.dto';

@Injectable()
export class ManejadorListarInmuebles {
  constructor(private _daoInmueble: DaoInmueble) {}

  async ejecutarListar(): Promise<InmuebleDto[]> {
    return this._daoInmueble.listar();
  }

  async ejecutarObtenerPorId(id: number): Promise<InmuebleDto> {
    return this._daoInmueble.obtenerPorId(id);
  }
}
