import { Pago } from '../../modelo/pago';

export abstract class RepositorioPago {
    abstract guardar(inmueble: Pago): Promise<void>;
}