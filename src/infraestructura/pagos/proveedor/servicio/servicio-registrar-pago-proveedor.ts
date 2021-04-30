import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { DaoPago } from 'src/dominio/pagos/puerto/dao/dao-pago';
import { RepositorioPago } from 'src/dominio/pagos/puerto/repositorio/repositorio-pago';
import { ServicioRegistrarPago } from 'src/dominio/pagos/servicio/servicio-registrar-pago';

export function servicioRegistrarPagoProveedor(
    repositorioUsuario: RepositorioPago,
    repositorioInmueble: RepositorioInmueble,
    daoInmueble: DaoInmueble,
    daoPago: DaoPago
) {
    return new ServicioRegistrarPago(repositorioUsuario, repositorioInmueble, daoInmueble, daoPago);
}
