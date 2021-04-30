import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { RepositorioPago } from 'src/dominio/pagos/puerto/repositorio/repositorio-pago';
import { ServicioRegistrarPago } from 'src/dominio/pagos/servicio/servicio-registrar-pago';

export function servicioRegistrarPagoProveedor(
    repositorioUsuario: RepositorioPago,
    repositorioInmueble: RepositorioInmueble
) {
    return new ServicioRegistrarPago(repositorioUsuario, repositorioInmueble);
}
