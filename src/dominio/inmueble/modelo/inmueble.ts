import { ErrorValorMinimo } from 'src/dominio/errores/error-valor-minimo';

export const VALOR_MINIMO_INMUEBLE = 150000

export class Inmueble {
    readonly #id: number
    readonly #direccion: string
    readonly #valor: number
    readonly #fechaAsignacion: Date
    readonly #usuarioId: number
    constructor(direccion: string, valor: number, id?: number, fechaAsignacion?: Date, usuarioId?: number) {
        this.validarValor(valor);
        this.#direccion = direccion;
        this.#valor = valor;
        if (fechaAsignacion) this.#fechaAsignacion = fechaAsignacion;
        if (usuarioId) this.#usuarioId = usuarioId;
        if (id) { this.#id = id; }
    }

    private validarValor(valor: number) {
        if (valor < VALOR_MINIMO_INMUEBLE) {
            throw new ErrorValorMinimo(`El valor mínimo de un inmueble es de ${VALOR_MINIMO_INMUEBLE}`);
        }
    }

    public get direccion(): string {
        return this.#direccion;
    }
    public get valor(): number {
        return this.#valor;
    }
    public get fechaAsignacion(): Date {
        return this.#fechaAsignacion;
    }
    public get usuarioId(): number {
        return this.#usuarioId;
    }
    public get id(): number {
        return this.#id;
    }
}