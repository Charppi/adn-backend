import { Injectable } from '@nestjs/common';
import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { InmuebleDto } from './dto/inmueble.dto';

@Injectable()
export class ManejadorListarInmuebles {
  constructor(private _daoInmueble: DaoInmueble) { }

  async ejecutarListar(limit: number, offset: number): Promise<{ inmuebles: InmuebleDto[], total: number }> {
    const inmuebles = await this._daoInmueble.listar(limit, offset);
    const total = await this._daoInmueble.totalInmuebles();
    return { inmuebles, total }
  }

  async ejecutarObtenerPorId(id: number): Promise<InmuebleDto> {
    return this._daoInmueble.obtenerInmueblePorId(id);
  }
}
