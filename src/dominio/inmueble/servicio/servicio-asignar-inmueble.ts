import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { DaoInmueble } from '../puerto/dao/dao-inmueble';
import { RepositorioInmueble } from '../puerto/repositorio/respositorio-inmueble';

export class ServicioAsignarInmueble {
    constructor(private readonly _repositorioInmueble: RepositorioInmueble,
        private readonly _daoInmueble: DaoInmueble
    ) { }

    async ejecutar(inmuebleId: number, usuarioId: number): Promise<void> {
        await this.validarExistenciaInmueble(inmuebleId);
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
}
