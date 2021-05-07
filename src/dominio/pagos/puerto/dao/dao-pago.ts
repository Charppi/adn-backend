import { PagoDto } from 'src/aplicacion/pagos/consulta/dto/pago.dto';

export abstract class DaoPago {
    abstract listar(): Promise<PagoDto[]>;
    abstract obtenerPagoPorId(id: number): Promise<PagoDto>;
    abstract obtenerTotalAbonosAnteriores(desde: Date, hasta: Date, usuarioId: number, inmuebleId: number): Promise<number>;
    abstract obtenerFechaUltimoPago(desde: Date, hasta: Date, usuarioId: number, inmuebleId: number): Promise<Date>;
}
