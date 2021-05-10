import moment from "moment"
import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio"

export const CARGO_POR_DIA_VENCIDO = 0.025

export class Pago {
    readonly #fechaPago: Date
    readonly #desde: Date
    readonly #hasta: Date
    readonly #valor: number
    readonly #usuarioId: number
    readonly #inmuebleId: number
    readonly #id: number
    readonly #pagosAnteriores: number

    fechaLimite: Date
    valorInmueble: number
    abonosAnterioresMasActual: number
    diasVencidos: number
    #cargo: number
    total: number

    constructor(desde: Date,
        hasta: Date,
        valor: number,
        usuarioId: number,
        inmuebleId: number,
        pagosAnteriores: number,
        fechaLimite: Date,
        valorInmueble: number,
        id?: number) {
        this.#desde = desde;
        this.#hasta = hasta;
        this.#valor = valor;
        this.#usuarioId = usuarioId;
        this.#fechaPago = new Date();
        this.#inmuebleId = inmuebleId;
        this.#pagosAnteriores = pagosAnteriores;
        this.fechaLimite = fechaLimite;
        this.valorInmueble = valorInmueble;
        this.#fechaPago = new Date();
        if (id) {
            this.#id = id;
        }

        this.validacionesYGeneracionDePago();

    }

    validacionesYGeneracionDePago() {
        this.setDiasPagoVencidos();
        this.setValorCargoDiasVencidos();
        this.setTotal();
        this.validarTotalAPagarMenorQueValorInmueble();
    }

    public setDiasPagoVencidos() {
        const ahora = moment();
        const limite = moment(this.fechaLimite);
        const diasVencidos = ahora.diff(limite, 'days');
        this.diasVencidos = diasVencidos > 0 ? diasVencidos : 0;
    }

    public setValorCargoDiasVencidos() {
        this.#cargo = (this.#valor * CARGO_POR_DIA_VENCIDO) * this.diasVencidos;
    }

    public setTotal() {
        this.total = this.cargo + this.#valor;

    }

    setAbonosAnterioresMasActual() {
        this.abonosAnterioresMasActual = this.#pagosAnteriores + this.#valor;
    }

    public getMensajeDePagoExitoso(valorInmueble: number, direccion: string, fechaInicioPago: Date, fechaLimitePago: Date) {
        const fechaInicioPagoFormateada = moment(fechaInicioPago).format("YYYY-MM-DD");
        const fechaLimitePagoFormateada = moment(fechaLimitePago).format("YYYY-MM-DD");
        return this.construirMensaje(valorInmueble, direccion, fechaInicioPagoFormateada, fechaLimitePagoFormateada)
    }

    private construirMensaje(valorInmueble: number, direccion: string, fechaInicioPagoFormateada: string, fechaLimitePagoFormateada: string) {
        let primeraParte: string
        let segundaParte: string
        let terceraParte: string

        if (Number(this.abonosAnterioresMasActual) === Number(valorInmueble)) {
            primeraParte = `El pago del inmueble ubicado en la dirección ${direccion},`
            segundaParte = `por el periodo de ${fechaInicioPagoFormateada} hasta ${fechaLimitePagoFormateada} ha sido completado.`
            terceraParte = `Se han actualizado las fechas de pago para el siguiente corte. Muchas gracias por su transacción.`
        } else {
            primeraParte = `El abono del inmueble ubicado en la dirección ${direccion},`
            segundaParte = `por el periodo de ${fechaInicioPagoFormateada} hasta ${fechaLimitePagoFormateada} ha sido recibido.`
            terceraParte = `Recuerde que aún queda un saldo bruto de $${valorInmueble - this.abonosAnterioresMasActual}. Muchas gracias por su transacción.`
        }
        return `${primeraParte} ${segundaParte} ${terceraParte}`
    }

    pagoCompletado(valorInmueble: number): boolean {
        return this.abonosAnterioresMasActual === valorInmueble;
    }

    validarTotalAPagarMenorQueValorInmueble() {
        this.setAbonosAnterioresMasActual();
        if (this.abonosAnterioresMasActual > this.valorInmueble) {
            const mensaje = this.#pagosAnteriores > 0
                ? `La suma de los abonos mas el pago actual supera el valor del inmueble. Total abonado hasta ahora: $${this.#pagosAnteriores}`
                : "El valor ingresado para pagar supera el valor del inmueble";
            throw new ErrorDeNegocio(mensaje);
        }
    }

    public get fechaPago(): Date {
        return this.#fechaPago;
    }
    public get inmuebleId(): number {
        return this.#inmuebleId;
    }
    public get desde(): Date {
        return this.#desde;
    }
    public get hasta(): Date {
        return this.#hasta;
    }
    public get valor(): number {
        return this.#valor;
    }
    public get usuario(): number {
        return this.#usuarioId;
    }
    public get id(): number {
        return this.#id;
    }

    public get cargo(): number {
        return this.#cargo;
    }

}