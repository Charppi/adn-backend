import { RepositorioUsuario } from '../puerto/repositorio/repositorio-usuario';
import { Usuario } from '../modelo/usuario';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { DaoUsuario } from '../puerto/dao/dao-usuario';

export class ServicioRegistrarUsuario {
  constructor(private readonly _repositorioUsuario: RepositorioUsuario,
    private readonly _daoUsuario: DaoUsuario
  ) { }

  async ejecutar(usuario: Usuario) {
    if (await this._daoUsuario.existeCedulaUsuario(usuario.cedula)) {
      throw new ErrorDeNegocio(
        `El documento ${usuario.cedula} ya está registrado`,
      );
    }
    await this._repositorioUsuario.guardar(usuario);
  }
}
