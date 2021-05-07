import { ErrorLongitudInvalida } from 'src/dominio/errores/error-longitud-invalida';

const TAMANO_CEDULA = 7;
export class Usuario {
  readonly #nombre: string;
  readonly #apellido: string;
  readonly #cedula: number;
  readonly #id?: number;

  constructor(nombre: string, apellido: string, cedula: number, id?: number) {
    this.validarTamanoCedula(cedula)
    this.#nombre = nombre;
    this.#apellido = apellido;
    this.#cedula = cedula;
    if (id) { this.#id = id; }
  }

  validarTamanoCedula(cedula: number) {
    if (String(cedula).length < TAMANO_CEDULA) throw new ErrorLongitudInvalida(`La cedula debe tener por lo menos ${TAMANO_CEDULA} dígitos`);
  }

  get nombre(): string {
    return this.#nombre;
  }

  get id(): number {
    return this.#id;
  }

  get apellido(): string {
    return this.#apellido;
  }

  get cedula(): number {
    return this.#cedula;
  }
}
