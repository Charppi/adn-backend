import { Injectable } from '@nestjs/common';
import { DaoPago } from 'src/dominio/pagos/puerto/dao/dao-pago';
import { PagoDto } from './dto/pago.dto';

@Injectable()
export class ManejadorListarPagos {
    constructor(private _daoPago: DaoPago) { }

    async ejecutarListar(): Promise<PagoDto[]> {
        return this._daoPago.listar();
    }

    async ejecutarObtenerPorId(id: number): Promise<PagoDto> {
        return this._daoPago.obtenerPagoPorId(id);
    }
}
