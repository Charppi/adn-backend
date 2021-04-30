import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { ServicioEditarInmueble } from 'src/dominio/inmueble/servicio/servicio-editar-inmueble';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';

export function servicioEditarInmuebleProveedor(
    repositorioInmueble: RepositorioInmueble,
    repositorioUsuario: RepositorioUsuario,
) {
    return new ServicioEditarInmueble(repositorioInmueble, repositorioUsuario);
}
