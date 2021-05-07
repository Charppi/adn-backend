import { RepositorioUsuario } from '../puerto/repositorio/repositorio-usuario';
import { Usuario } from '../modelo/usuario';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { DaoUsuario } from '../puerto/dao/dao-usuario';

export class ServicioEditarUsuario {
    constructor(private readonly _repositorioUsuario: RepositorioUsuario,
        private readonly _daoUsuario: DaoUsuario
    ) { }

    async ejecutar(usuario: Usuario) {
        await this.validarCedula(usuario.cedula, usuario.id);
        await this._repositorioUsuario.guardar(usuario);
    }
    async validarCedula(cedula: number, id: number) {
        const usuario = await this._daoUsuario.existeCedulaUsuarioDiferente(cedula, id);
        if (usuario) {
            throw new ErrorDeNegocio(
                `El documento ${cedula} ya está registrado`,
            );
        }
    }
}
