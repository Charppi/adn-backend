import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { ServicioAsignarInmueble } from 'src/dominio/inmueble/servicio/servicio-asignar-inmueble';

export function servicioAsignarInmuebleProveedor(
    repositorioInmueble: RepositorioInmueble,
    daoInmueble: DaoInmueble,
) {
    return new ServicioAsignarInmueble(repositorioInmueble, daoInmueble);
}
