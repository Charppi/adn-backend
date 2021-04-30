import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';

export abstract class DaoUsuario {
  abstract listar(): Promise<UsuarioDto[]>;
  abstract existeCedulaUsuario(cedula: number): Promise<boolean>;
  abstract obtenerUsuarioId(id: number): Promise<UsuarioDto>
}
