import { ErrorDeNegocio } from './error-de-negocio';

export class ErrorTotalAPagarMenorQueValorInmueble extends ErrorDeNegocio {
    constructor(mensaje: string) {
        super(mensaje, ErrorTotalAPagarMenorQueValorInmueble.name);
    }
}
