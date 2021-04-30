import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositorioPago } from 'src/dominio/pagos/puerto/repositorio/repositorio-pago';
import { PagoEntidad } from '../../entidad/pago.entidad';
import { Pago } from 'src/dominio/pagos/modelo/pago';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { InmuebleEntidad } from 'src/infraestructura/inmueble/entidad/inmueble.entidad';

@Injectable()
export class RepositorioPagoMysql implements RepositorioPago {
    constructor(
        @InjectRepository(PagoEntidad)
        private readonly repositorio: Repository<PagoEntidad>,
    ) { }
    async obtenerPagosAnteriores(desde: Date, hasta: Date, usuario: UsuarioEntidad, inmueble: InmuebleEntidad): Promise<PagoEntidad[]> {
        return await this.repositorio.find({ where: { desde, hasta, usuario, inmueble }, order: { fechaPago: "DESC" } })
    }
    async obtenerPagoPorId(id: number): Promise<PagoEntidad> {
        return await this.repositorio.findOne(id)
    }
    async guardar(pago: PagoEntidad): Promise<void> {
        await this.repositorio.save(pago)
    }
}
