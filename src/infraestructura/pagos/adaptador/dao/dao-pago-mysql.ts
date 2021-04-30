import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DaoPago } from 'src/dominio/pagos/puerto/dao/dao-pago';
import { PagoDto } from 'src/aplicacion/pagos/consulta/dto/pago.dto';
import { PagoEntidad } from '../../entidad/pago.entidad';

@Injectable()
export class DaoPagoMysql implements DaoPago {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) { }
    obtenerPagoPorId(id: number): Promise<PagoDto> {
        return this.entityManager.query(`SELECT * from pago WHERE id = :id`, [id]);
    }
    async obtenerTotalAbonosAnteriores(desde: Date, hasta: Date, usuarioId: number, inmuebleId: number): Promise<number> {
        const { totalPagos } = await this.entityManager.createQueryBuilder()
            .select("SUM(pago.valor)", "totalPagos")
            .from(PagoEntidad, "pago")
            .where("pago.desde = :desde", { desde })
            .andWhere("pago.hasta = :hasta", { hasta })
            .andWhere("pago.usuarioId = :usuarioId", { usuarioId })
            .andWhere("pago.inmuebleId = :inmuebleId", { inmuebleId })
            .orderBy("pago.id", "DESC")
            .getRawOne()

        return totalPagos | 0
    }
    async obtenerFechaUltimoPago(desde: Date, hasta: Date, usuarioId: number, inmuebleId: number): Promise<Date> {
        return await this.entityManager.createQueryBuilder()
            .select()
            .from(PagoEntidad, "pago")
            .where("pago.desde = :desde", { desde })
            .andWhere("pago.hasta = :hasta", { hasta })
            .andWhere("pago.usuarioId = :usuarioId", { usuarioId })
            .andWhere("pago.inmuebleId = :inmuebleId", { inmuebleId })
            .orderBy("pago.id", "DESC")
            .getRawOne()
    }


    async listar(): Promise<PagoDto[]> {
        return this.entityManager.query(
            'SELECT * from pago',
        );
    }
}
