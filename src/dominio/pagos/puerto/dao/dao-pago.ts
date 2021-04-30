import { PagoDto } from 'src/aplicacion/pagos/consulta/dto/pago.dto';

export abstract class DaoPago {
    abstract listar(): Promise<PagoDto[]>;
    abstract obtenerPorId(id: number): Promise<PagoDto>;
}
