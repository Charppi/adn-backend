import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';

export abstract class DaoUsuario {
  abstract listar(limit: number, offset: number): Promise<UsuarioDto[]>;
  abstract totalUsuarios(): Promise<number>;
  abstract existeCedulaUsuario(cedula: number): Promise<boolean>;
  abstract existeCedulaUsuarioDiferente(cedula: number, id: number): Promise<UsuarioDto>;
  abstract obtenerUsuarioId(id: number): Promise<UsuarioDto>
  abstract listarTodos(): Promise<UsuarioDto[]>;
}
