import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { InmuebleDto } from 'src/aplicacion/inmueble/consulta/dto/inmueble.dto';
import { InmuebleEntidad } from '../../entidad/inmueble.entidad';

@Injectable()
export class DaoInmobiliariaMysql implements DaoInmueble {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }
  totalInmuebles(): Promise<number> {
    return this.entityManager.count(InmuebleEntidad);
  }
  async existeDireccionInmueble(direccion: string): Promise<boolean> {
    return (await this.entityManager.count(InmuebleEntidad, { where: { direccion } })) > 0;
  }
  async existeInmueble(id: number): Promise<boolean> {
    return (await this.entityManager.count(InmuebleEntidad, { where: { id } })) > 0;
  }

  async obtenerInmueblePorId(id: number): Promise<InmuebleDto> {
    return await this.entityManager.getRepository(InmuebleEntidad).findOne(id, { relations: ['usuario'] });
  }

  async listar(limit: number, offset: number): Promise<InmuebleDto[]> {
    const queryLimit = (limit > 0 && offset > 0) ? ` LIMIT ${limit} OFFSET ${offset};` : ';';

    return this.entityManager.query(
      `SELECT * FROM inmueble${queryLimit}`,
    );
  }
}
