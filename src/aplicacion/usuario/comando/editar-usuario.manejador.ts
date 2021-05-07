import { Injectable } from '@nestjs/common';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { ServicioEditarUsuario } from 'src/dominio/usuario/servicio/serrvicio-editar-usuario';
import { ComandoEditarUsuario } from './editar-usuario.comando';

@Injectable()
export class ManejadorEditarUsuario {
    constructor(private _servicioEditarUsuario: ServicioEditarUsuario) { }

    async ejecutar(comandoRegistrarUsuario: ComandoEditarUsuario) {
        await this._servicioEditarUsuario.ejecutar(
            new Usuario(
                comandoRegistrarUsuario.nombre,
                comandoRegistrarUsuario.apellido,
                comandoRegistrarUsuario.cedula,
                comandoRegistrarUsuario.id
            ),
        );
    }
}
