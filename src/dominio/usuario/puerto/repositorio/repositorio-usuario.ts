import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { Usuario } from '../../modelo/usuario';

export abstract class RepositorioUsuario {
  abstract existeCedulaUsuario(cedula: number): Promise<boolean>;
  abstract obtenerUsuarioId(id: number): Promise<UsuarioEntidad>
  abstract guardar(usuario: Usuario): Promise<void>;
}
