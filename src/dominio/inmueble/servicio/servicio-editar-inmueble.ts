import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { Inmueble } from '../modelo/inmueble';
import { DaoInmueble } from '../puerto/dao/dao-inmueble';
import { RepositorioInmueble } from '../puerto/repositorio/respositorio-inmueble';

export class ServicioEditarInmueble {
    constructor(private readonly _repositorioInmueble: RepositorioInmueble,
        private readonly _daoInmueble: DaoInmueble
    ) { }

    async ejecutar(inmueble: Inmueble): Promise<void> {
        await this.validarExistenciaDeInmueble(inmueble);
        this.validarFechaAsignacion(inmueble);
        await this._repositorioInmueble.editar(inmueble);
    }

    private validarFechaAsignacion(inmueble: Inmueble) {
        if (!inmueble.fechaAsignacion && inmueble.usuarioId) {
            throw new ErrorDeNegocio(
                `Si va a asignar el inmueble a un nuevo usuario, debe ingresar la fecha de asignación del inmueble`
            );
        }
    }

    private async validarExistenciaDeInmueble(inmueble: Inmueble) {
        const existeInmueble = await this._daoInmueble.obtenerInmueblePorId(inmueble.id);
        if (!existeInmueble) {
            throw new ErrorDeNegocio(
                `No existe un inmueble con el identificador ${inmueble.id}`
            );
        }
    }
}
