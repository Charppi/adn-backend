import { Inmueble } from 'src/dominio/inmueble/modelo/inmueble';
import { ServicioRegistrarInmueble } from 'src/dominio/inmueble/servicio/servicio-registrar-inmueble';
import { ComandoRegistrarInmueble } from 'src/aplicacion/inmueble/comando/registrar-inmueble.comando';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ManejadorRegistrarInmueble {
  constructor(private _servicioRegistrarInmueble: ServicioRegistrarInmueble) { }

  async ejecutar(comandoRegistrarInmueble: ComandoRegistrarInmueble) {
    await this._servicioRegistrarInmueble.ejecutar(
      new Inmueble(
        comandoRegistrarInmueble.direccion,
        comandoRegistrarInmueble.valor,
      ),
    );
  }
}
