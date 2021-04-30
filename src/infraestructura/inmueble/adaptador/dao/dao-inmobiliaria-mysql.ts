import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { InmuebleDto } from 'src/aplicacion/inmueble/consulta/dto/inmueble.dto';

@Injectable()
export class DaoInmobiliariaMysql implements DaoInmueble {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}
  obtenerPorId(id: number): Promise<InmuebleDto> {
    return this.entityManager.query(`SELECT * from inmueble WHERE id = :id`, [
      id,
    ]);
  }

  async listar(): Promise<InmuebleDto[]> {
    return this.entityManager.query(
      'SELECT * from inmueble',
    );
  }
}
