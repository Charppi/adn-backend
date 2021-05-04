import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { ServicioAsignarInmueble } from 'src/dominio/inmueble/servicio/servicio-asignar-inmueble';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';

export function servicioAsignarInmuebleProveedor(
    repositorioInmueble: RepositorioInmueble,
    daoInmueble: DaoInmueble,
    daoUsuario: DaoUsuario
) {
    return new ServicioAsignarInmueble(repositorioInmueble, daoInmueble, daoUsuario);
}
