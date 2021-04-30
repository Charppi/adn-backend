import { InmuebleEntidad } from 'src/infraestructura/inmueble/entidad/inmueble.entidad';
import { PagoEntidad } from 'src/infraestructura/pagos/entidad/pago.entidad';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { Pago } from '../../modelo/pago';

export abstract class RepositorioPago {
    abstract obtenerPagoPorId(id: number): Promise<PagoEntidad>
    abstract obtenerPagosAnteriores(desde: Date, hasta: Date, usuario: UsuarioEntidad, inmueble: InmuebleEntidad): Promise<PagoEntidad[]>
    abstract guardar(inmueble: PagoEntidad): Promise<void>;
}