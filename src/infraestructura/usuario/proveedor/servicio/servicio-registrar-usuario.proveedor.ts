import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';

export function servicioRegistrarUsuarioProveedor(
  repositorioUsuario: RepositorioUsuario,
  daoUsuario: DaoUsuario
) {
  return new ServicioRegistrarUsuario(repositorioUsuario, daoUsuario);
}
