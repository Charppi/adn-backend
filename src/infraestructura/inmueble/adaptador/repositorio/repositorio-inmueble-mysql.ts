import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { Inmueble } from 'src/dominio/inmueble/modelo/inmueble';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { Repository } from 'typeorm';
import { InmuebleEntidad } from '../../entidad/inmueble.entidad';

@Injectable()
export class RepositorioInmuebleMysql implements RepositorioInmueble {
  constructor(
    @InjectRepository(InmuebleEntidad)
    private readonly repositorio: Repository<InmuebleEntidad>,
  ) { }
  async actualizarFechasDePago(id: number, fechaInicioPago: Date, fechaLimitePago: Date): Promise<void> {
    await this.repositorio.createQueryBuilder()
      .update()
      .set({ fechaInicioPago, fechaLimitePago })
      .where("id = :id", { id })
      .execute()
  }

  async guardar(inmueble: Inmueble): Promise<void> {
    const entidad = new InmuebleEntidad();
    entidad.direccion = inmueble.direccion;
    entidad.valor = inmueble.valor;
    await this.repositorio.save(entidad);
  }
  async editar({ direccion, valor, id }: Inmueble) {
    await this.repositorio.createQueryBuilder()
      .update()
      .set({ direccion, valor })
      .where("id = :id", { id })
      .execute()
  }

  async asignarInmueble(id: number, usuarioId: number) {
    const fechaAsignacion = new Date()
    const fechaInicioPago = fechaAsignacion
    const fechaLimitePago = moment(fechaInicioPago).add(1, "month").toDate()
    await this.repositorio.createQueryBuilder()
      .update()
      .set({ usuarioId, fechaAsignacion, fechaInicioPago, fechaLimitePago })
      .where({ id })
      .execute()
  }

  async actualizarDatosDePago(inmueble: InmuebleEntidad) {
    await this.repositorio.save(inmueble)
  }


}
