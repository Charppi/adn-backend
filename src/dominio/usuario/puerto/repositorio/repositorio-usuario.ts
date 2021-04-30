import { Usuario } from '../../modelo/usuario';

export abstract class RepositorioUsuario {
  abstract guardar(usuario: Usuario): Promise<void>;
}
