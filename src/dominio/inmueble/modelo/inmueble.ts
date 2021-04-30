import { ErrorValorMinimo } from 'src/dominio/errores/error-valor-minimo';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';

export const VALOR_MINIMO_INMUEBLE = 150000

export class Inmueble {
    readonly #id: number
    readonly #direccion: string
    readonly #valor: number
    readonly #fechaAsignacion: Date
    readonly #usuario: UsuarioEntidad
    constructor(direccion: string, valor: number, id?: number, fechaAsignacion?: Date, usuario?: UsuarioEntidad) {
        this.validarValor(valor)
        this.#direccion = direccion
        this.#valor = valor
        if (fechaAsignacion) this.#fechaAsignacion = fechaAsignacion
        if (usuario) this.#usuario = usuario
        if (id) this.#id = id
    }

    private validarValor(valor: number) {
        if (valor < VALOR_MINIMO_INMUEBLE) {
            throw new ErrorValorMinimo(`El valor mínimo de un inmueble es de ${VALOR_MINIMO_INMUEBLE}`)
        }
    }

    public get direccion(): string {
        return this.#direccion
    }
    public get valor(): number {
        return this.#valor
    }
    public get fechaAsignacion(): Date {
        return this.#fechaAsignacion
    }
    public get usuario(): UsuarioEntidad {
        return this.#usuario
    }
    public get id(): number {
        return this.#id
    }
}