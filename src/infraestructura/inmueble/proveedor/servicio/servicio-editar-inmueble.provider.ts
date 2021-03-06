import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { ServicioEditarInmueble } from 'src/dominio/inmueble/servicio/servicio-editar-inmueble';

export function servicioEditarInmuebleProveedor(
    repositorioInmueble: RepositorioInmueble,
    daoInmueble: DaoInmueble,
) {
    return new ServicioEditarInmueble(repositorioInmueble, daoInmueble);
}
