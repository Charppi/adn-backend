import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositorioPago } from 'src/dominio/pagos/puerto/repositorio/repositorio-pago';
import { PagoEntidad } from '../../entidad/pago.entidad';
import { Pago } from 'src/dominio/pagos/modelo/pago';
import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';

@Injectable()
export class RepositorioPagoMysql implements RepositorioPago {
    constructor(
        @InjectRepository(PagoEntidad)
        private readonly repositorio: Repository<PagoEntidad>,
        private readonly _daoInmueble: DaoInmueble,
    ) { }

    async guardar({ cargo, desde, hasta, valor, inmuebleId, fechaPago, total }: Pago): Promise<void> {
        const inmueble = await this._daoInmueble.obtenerInmueblePorId(inmuebleId)
        const usuario = inmueble.usuario
        this.repositorio.createQueryBuilder()
            .insert()
            .values({ cargo, desde, hasta, valor, inmueble, usuario, fechaPago, total })
            .execute()

    }
}
