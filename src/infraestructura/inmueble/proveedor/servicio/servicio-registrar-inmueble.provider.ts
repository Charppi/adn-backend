import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { ServicioRegistrarInmueble } from 'src/dominio/inmueble/servicio/servicio-registrar-inmueble';

export function servicioRegistrarInmuebleProveedor(
  repositorioInmueble: RepositorioInmueble,
) {
  return new ServicioRegistrarInmueble(repositorioInmueble);
}
