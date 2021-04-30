import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { Inmueble } from '../modelo/inmueble';
import { RepositorioInmueble } from '../puerto/repositorio/respositorio-inmueble';

export class ServicioRegistrarInmueble {
  constructor(private readonly _repositorioInmueble: RepositorioInmueble) { }

  async ejecutar(inmueble: Inmueble): Promise<void> {
    if (await this._repositorioInmueble.existeDireccionInmueble(inmueble.direccion)) {
      throw new ErrorDeNegocio(
        `Ya existe un inmueble para la dirección ${inmueble.direccion}`,
      );
    }
    await this._repositorioInmueble.guardar(inmueble);
  }
}
