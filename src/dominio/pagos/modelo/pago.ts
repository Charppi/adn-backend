import { Inmueble } from "src/dominio/inmueble/modelo/inmueble"
import { Usuario } from "src/dominio/usuario/modelo/usuario"

export class Pago {
    readonly #fechaPago: Date
    readonly #desde: Date
    readonly #hasta: Date
    readonly #valor: number
    readonly #usuario: Usuario
    readonly #inmueble: Inmueble
    readonly #id: number
    readonly #totalAbonos: number
    readonly #cargo: number

    constructor(desde: Date, hasta: Date, valor: number, totalAbonos: number, usuario: Usuario, inmueble: Inmueble, id?: number) {
        this.#desde = desde
        this.#hasta = hasta
        this.#valor = valor
        this.#usuario = usuario
        this.#fechaPago = new Date()
        this.#inmueble = inmueble
        this.#totalAbonos = totalAbonos
        if (id) this.#id = id
    }



    public get fechaPago(): Date {
        return this.#fechaPago
    }
    public get inmueble(): Inmueble {
        return this.#inmueble
    }
    public get desde(): Date {
        return this.#desde
    }
    public get hasta(): Date {
        return this.#hasta
    }
    public get valor(): number {
        return this.#valor
    }
    public get totalAbonos(): number {
        return this.#totalAbonos
    }
    public get usuario(): Usuario {
        return this.#usuario
    }
    public get id(): number {
        return this.#id
    }

}