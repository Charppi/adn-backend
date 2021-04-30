import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { Inmueble } from '../modelo/inmueble';
import { RepositorioInmueble } from '../puerto/repositorio/respositorio-inmueble';

export class ServicioEditarInmueble {
    constructor(private readonly _repositorioInmueble: RepositorioInmueble,
        private readonly _repositorioUsuario: RepositorioUsuario
    ) { }

    async ejecutar(inmueble: Inmueble): Promise<void> {
        const existeInmueble = await this._repositorioInmueble.obtenerInmueblePorId(inmueble.id);
        if (!existeInmueble) {
            throw new ErrorDeNegocio(
                `No existe un inmueble con el identificador ${inmueble.id}`,
            );
        }
        if (!inmueble.fechaAsignacion && inmueble.usuario) {
            throw new ErrorDeNegocio(
                `Si va a asignar el inmueble a un nuevo usuario, debe ingresar la fecha de asignación del inmueble`,
            );
        }
        await this._repositorioInmueble.editar(inmueble);
    }

    async obtenerUsuario(idUsuario: number): Promise<UsuarioEntidad> {
        const usuario = await this._repositorioUsuario.obtenerUsuarioId(idUsuario)
        if (!usuario) {
            throw new ErrorDeNegocio(
                `No existe un usuario con el id ${idUsuario}`
            )
        }
        return usuario
    }
}
