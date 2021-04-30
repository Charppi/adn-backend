import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DaoPago } from 'src/dominio/pagos/puerto/dao/dao-pago';
import { PagoDto } from 'src/aplicacion/pagos/consulta/dto/pago.dto';

@Injectable()
export class DaoPagoMysql implements DaoPago {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) { }

    obtenerPorId(id: number): Promise<PagoDto> {
        return this.entityManager.query(`SELECT * from pago WHERE id = :id`, [
            id,
        ]);
    }

    async listar(): Promise<PagoDto[]> {
        return this.entityManager.query(
            'SELECT * from pago',
        );
    }
}
