import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { ComandoRegistrarPago } from 'src/aplicacion/pagos/comando/registrar-pago.comando';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { PagoEntidad } from 'src/infraestructura/pagos/entidad/pago.entidad';
import { Pago } from '../modelo/pago';
import { RepositorioPago } from '../puerto/repositorio/repositorio-pago';
import moment from 'moment';
import { Inmueble } from 'src/dominio/inmueble/modelo/inmueble';
import { InmuebleEntidad } from 'src/infraestructura/inmueble/entidad/inmueble.entidad';

export const CARGO_POR_DIA_VENCIDO = 0.025

export class ServicioRegistrarPago {
    constructor(private readonly _repositorioPago: RepositorioPago,
        private readonly _repositorioInmueble: RepositorioInmueble
    ) { }

    async ejecutar({ idInmueble, idPagador, valor }: ComandoRegistrarPago): Promise<string> {

        const inmueble = await this._repositorioInmueble.obtenerInmueblePorId(idInmueble);

        this.validarExisteInmueble(inmueble, idInmueble);

        this.validarPropietario(inmueble, idPagador);

        const pagosAnteriores = await this._repositorioPago.obtenerPagosAnteriores(inmueble.fechaInicioPago, inmueble.fechaLimitePago, inmueble.usuario, inmueble)

        //En caso de que hayan abonos entonces tomo los días vencidos a partir del último abono, sino, desde la fecha limite de pago
        const diasVencidos = this.diasPagoVencido(pagosAnteriores.length > 0 ? pagosAnteriores[0].fechaPago : inmueble.fechaLimitePago)
        const valorCargoPorDia = this.valorCargoDiasVencidos(inmueble.valor, diasVencidos > 0 ? diasVencidos : 0)
        const totalAbonos = this.totalAbonos(pagosAnteriores) + valor

        this.validarTotalAPagarMenorQueValorInmueble(totalAbonos, inmueble, pagosAnteriores);

        const pago = this.setPago(inmueble, valorCargoPorDia, valor)

        await this._repositorioPago.guardar(pago);
        let mensaje = ``
        if (totalAbonos === inmueble.valor) {
            mensaje = `El pago del inmueble ubicado en la dirección ${inmueble.direccion}, por el periodo de ${inmueble.fechaInicioPago} hasta ${inmueble.fechaLimitePago} ha sido completado. Se han actualizado las fechas de pago para el siguiente corte. Muchas gracias por su transacción.`
            inmueble.fechaInicioPago = moment(inmueble.fechaLimitePago).add(1, "month").toDate()
            inmueble.fechaLimitePago = moment(inmueble.fechaInicioPago).add(1, "month").toDate()
            await this._repositorioInmueble.actualizarDatosDePago(inmueble);
        } else {
            mensaje = `El abono del inmueble ubicado en la dirección ${inmueble.direccion}, por el periodo de ${moment(inmueble.fechaInicioPago).format("YYYY-MM-DD")} hasta ${moment(inmueble.fechaLimitePago).format("YYYY-MM-DD")} ha sido recibido. Recuerde que aún queda un saldo bruto de $${inmueble.valor - totalAbonos}. Muchas gracias por su transacción.`
        }
        return mensaje
    }

    private validarTotalAPagarMenorQueValorInmueble(totalAbonos: number, inmueble: InmuebleEntidad, pagosAnteriores: PagoEntidad[]) {
        if (totalAbonos > inmueble.valor) {
            const mensaje = pagosAnteriores.length > 0
                ? `La suma de los abonos mas el pago actual supera el valor del inmueble. Total abonado hasta ahora: $${this.totalAbonos(pagosAnteriores)}`
                : "El valor ingresado para pagar supera el valor del inmueble";
            throw new ErrorDeNegocio(mensaje);
        }
    }

    private validarPropietario(inmueble: InmuebleEntidad, idPagador: number) {
        if (!this.pagoRealizadoPorActualPropietario(inmueble.usuario.id, idPagador)) {
            throw new ErrorDeNegocio(`El usuario que intenta realizar el pago no es el propietario parcial del inmueble`);
        }
    }

    private validarExisteInmueble(inmueble: InmuebleEntidad, idInmueble: number) {
        if (!inmueble) {
            throw new ErrorDeNegocio(`No se encontró ningún inmueble con el id ${idInmueble}`);
        }
    }

    setPago(inmueble: InmuebleEntidad, valorCargoPorDia: number, valor: number) {
        const usuario = inmueble.usuario
        const pago = new PagoEntidad()
        pago.cargo = valorCargoPorDia
        pago.desde = inmueble.fechaInicioPago
        pago.fechaPago = new Date()
        pago.hasta = inmueble.fechaLimitePago
        pago.total = valor + valorCargoPorDia
        pago.usuario = usuario
        pago.valor = valor
        return pago
    }

    valorCargoDiasVencidos(diasVencidos: number, valor: number) {
        return (valor * CARGO_POR_DIA_VENCIDO) * diasVencidos
    }

    diasPagoVencido(fechaLimite: Date) {
        const ahora = moment()
        const limite = moment(fechaLimite)
        return ahora.diff(limite, "days")
    }

    pagoRealizadoPorActualPropietario(idPropietario: number, idPagador: number) {
        return idPagador === idPropietario
    }

    totalAbonos(pagosAnteriores: PagoEntidad[]) {
        let totalAbonos = 0
        for (const pago of pagosAnteriores) {
            totalAbonos += pago.valor
        }
        return totalAbonos
    }


}
