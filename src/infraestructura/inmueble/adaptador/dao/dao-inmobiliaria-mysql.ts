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
  async existeDireccionInmueble(direccion: string): Promise<boolean> {
    return (await this.entityManager.count(InmuebleEntidad, { where: { direccion } })) > 0
  }
  async existeInmueble(id: number): Promise<boolean> {
    return (await this.entityManager.count(InmuebleEntidad, { where: { id } })) > 0
  }

  async obtenerInmueblePorId(id: number): Promise<InmuebleDto> {
    return await this.entityManager.getRepository(InmuebleEntidad).findOne(id, { relations: ["usuario"] })
  }

  async listar(): Promise<InmuebleDto[]> {
    return this.entityManager.query(
      'SELECT * from inmueble',
    );
  }
}
