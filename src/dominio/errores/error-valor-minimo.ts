import { ErrorDeNegocio } from './error-de-negocio';

export class ErrorValorMinimo extends ErrorDeNegocio {
  constructor(mensaje: string) {
    super(mensaje, ErrorValorMinimo.name);
  }
}
