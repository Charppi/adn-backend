import { Injectable } from '@nestjs/common';
import { ComandoRegistrarPago } from './registrar-pago.comando';
import { ServicioRegistrarPago } from 'src/dominio/pagos/servicio/servicio-registrar-pago';

@Injectable()
export class ManejadorRegistrarPago {
    constructor(private _servicioRegistrarPago: ServicioRegistrarPago) { }

    async ejecutar(comandoRegistrarPago: ComandoRegistrarPago) {
        return await this._servicioRegistrarPago.ejecutar(
            comandoRegistrarPago.idInmueble,
            comandoRegistrarPago.idPagador,
            comandoRegistrarPago.valor
        );
    }
}
