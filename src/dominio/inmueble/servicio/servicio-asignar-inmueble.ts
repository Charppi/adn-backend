import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { DaoInmueble } from '../puerto/dao/dao-inmueble';
import { RepositorioInmueble } from '../puerto/repositorio/respositorio-inmueble';

export class ServicioAsignarInmueble {
    constructor(private readonly _repositorioInmueble: RepositorioInmueble,
        private readonly _daoInmueble: DaoInmueble,
        private readonly _daoUsuario: DaoUsuario,
    ) { }

    async ejecutar(inmuebleId: number, usuarioId: number): Promise<void> {
        await this.validarExistenciaInmueble(inmuebleId);
        await this.validarUsuario(usuarioId);
        await this._repositorioInmueble.asignarInmueble(inmuebleId, usuarioId);
    }


    private async validarExistenciaInmueble(inmuebleId: number) {
        const existeInmueble = await this._daoInmueble.obtenerInmueblePorId(inmuebleId);
        if (!existeInmueble) {
            throw new ErrorDeNegocio(
                `No existe un inmueble con el identificador ${inmuebleId}`
            );
        }
    }
    private async validarUsuario(id: number) {
        const existeUsuario = await this._daoUsuario.obtenerUsuarioId(id);
        if (!existeUsuario) {
            throw new ErrorDeNegocio(`No se encontró un usuario con el id ${id}`)
        }
    }
}
