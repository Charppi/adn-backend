import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { ServicioEditarUsuario } from 'src/dominio/usuario/servicio/serrvicio-editar-usuario';

export function servicioEditarUsuarioProveedor(
    repositorioUsuario: RepositorioUsuario,
    daoUsuario: DaoUsuario
) {
    return new ServicioEditarUsuario(repositorioUsuario, daoUsuario);
}
