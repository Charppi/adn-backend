import { Inmueble } from 'src/dominio/inmueble/modelo/inmueble';
import { Injectable } from '@nestjs/common';
import { ServicioEditarInmueble } from 'src/dominio/inmueble/servicio/servicio-editar-inmueble';
import { ComandoEditarInmueble } from "../comando/editar-inmueble.comando";

@Injectable()
export class ManejadorEditarInmueble {
    constructor(
        private _servicioEditarInmueble: ServicioEditarInmueble,
    ) { }

    async ejecutar(comandoRegistrarInmueble: ComandoEditarInmueble) {
        await this._servicioEditarInmueble.ejecutar(new Inmueble(
            comandoRegistrarInmueble.direccion,
            comandoRegistrarInmueble.valor,
            comandoRegistrarInmueble.id
        ));
    }
}
