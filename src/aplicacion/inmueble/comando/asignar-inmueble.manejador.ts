import { Injectable } from '@nestjs/common';
import { ServicioAsignarInmueble } from 'src/dominio/inmueble/servicio/servicio-asignar-inmueble';
import { ComandoAsignarInmueble } from './asignar-inmueble.comando';

@Injectable()
export class ManejadorAsignarInmueble {
    constructor(
        private _servicioAsignarInmueble: ServicioAsignarInmueble,
    ) { }

    async ejecutar(comandoAsignarInmueble: ComandoAsignarInmueble) {
        await this._servicioAsignarInmueble.ejecutar(comandoAsignarInmueble.id, comandoAsignarInmueble.idUsuarioAsignado);
    }
}
