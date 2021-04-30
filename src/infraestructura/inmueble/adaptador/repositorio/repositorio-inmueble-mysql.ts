import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inmueble } from 'src/dominio/inmueble/modelo/inmueble';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { Repository } from 'typeorm';
import { InmuebleEntidad } from '../../entidad/inmueble.entidad';
import moment from "moment"

@Injectable()
export class RepositorioInmuebleMysql implements RepositorioInmueble {
  constructor(
    @InjectRepository(InmuebleEntidad)
    private readonly repositorio: Repository<InmuebleEntidad>,
  ) { }
  async obtenerInmueblePorId(id: number): Promise<InmuebleEntidad> {
    return await this.repositorio.findOne(id, { relations: ["usuario"] })
  }

  async existeDireccionInmueble(direccion: string): Promise<boolean> {
    return (await this.repositorio.count({ direccion })) > 0;
  }
  async guardar(inmueble: Inmueble): Promise<void> {
    const entidad = new InmuebleEntidad();
    entidad.direccion = inmueble.direccion;
    entidad.valor = inmueble.valor;
    await this.repositorio.save(entidad);
  }
  async editar(inmueble: Inmueble) {
    const entidad = new InmuebleEntidad();
    entidad.direccion = inmueble.direccion
    entidad.valor = inmueble.valor
    entidad.fechaAsignacion = inmueble.fechaAsignacion
    entidad.fechaInicioPago = inmueble.fechaAsignacion
    entidad.fechaLimitePago = moment(inmueble.fechaAsignacion).add(1, "month").toDate()
    entidad.usuario = inmueble.usuario
    entidad.id = inmueble.id
    await this.repositorio.save(entidad)
  }

  async actualizarDatosDePago(inmueble: InmuebleEntidad) {
    await this.repositorio.save(inmueble)
  }

  async existeInmueble(id: number): Promise<boolean> {
    return (await this.repositorio.count({ id })) > 0;
  }

}
