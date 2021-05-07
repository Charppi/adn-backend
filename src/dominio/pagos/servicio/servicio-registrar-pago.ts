import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { Pago } from '../modelo/pago';
import { RepositorioPago } from '../puerto/repositorio/repositorio-pago';
import { DaoPago } from '../puerto/dao/dao-pago';
import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import moment from 'moment';
import { InmuebleDto } from 'src/aplicacion/inmueble/consulta/dto/inmueble.dto';


export class ServicioRegistrarPago {
    constructor(private readonly _repositorioPago: RepositorioPago,
        private readonly _repositorioInmueble: RepositorioInmueble,
        private readonly _daoInmueble: DaoInmueble,
        private readonly _daoPago: DaoPago

    ) { }

    async ejecutar(idInmueble: number, idPagador: number, valor: number): Promise<string> {
        valor = Number(valor)
        const inmueble = await this.validarExisteInmueble(idInmueble);

        this.validarPropietario(inmueble.usuario?.id, idPagador);

        const abonosAnteriores = await this._daoPago.obtenerTotalAbonosAnteriores(
            inmueble.fechaInicioPago,
            inmueble.fechaLimitePago,
            inmueble.usuario.id,
            inmueble.id)

        let fechaLimitePago = abonosAnteriores > 0 ?
            await this._daoPago.obtenerFechaUltimoPago(
                inmueble.fechaInicioPago, inmueble.fechaLimitePago,
                inmueble.usuario.id,
                inmueble.id)
            : inmueble.fechaLimitePago

        const pago = new Pago(inmueble.fechaInicioPago,
            inmueble.fechaLimitePago,
            valor,
            inmueble.usuario.id,
            inmueble.id,
            abonosAnteriores,
            fechaLimitePago,
            inmueble.valor
        )

        await this._repositorioPago.guardar(pago);

        const fechaInicioPago = this.setNuevaFechaDePago(inmueble.fechaInicioPago)
        fechaLimitePago = this.setNuevaFechaDePago(inmueble.fechaLimitePago)

        await this.validarPagoCompletado(pago, inmueble, fechaInicioPago, fechaLimitePago);

        return pago.getMensajeDePagoExitoso(inmueble.valor, inmueble.direccion, inmueble.fechaInicioPago, inmueble.fechaLimitePago)

    }

    private async validarPagoCompletado(pago: Pago, inmueble: InmuebleDto, fechaInicioPago: Date, fechaLimitePago: Date) {
        if (pago.pagoCompletado(inmueble.valor)) {
            await this._repositorioInmueble.actualizarFechasDePago(inmueble.id, fechaInicioPago, fechaLimitePago);
        }
    }

    private setNuevaFechaDePago(fechaAntigua: Date): Date {
        return moment(fechaAntigua).add(1, "month").toDate()
    }

    private validarPropietario(usuarioId: number, idPagador: number) {
        if (!this.pagoRealizadoPorActualPropietario(usuarioId, idPagador)) {
            throw new ErrorDeNegocio(`El usuario que intenta realizar el pago no es el propietario parcial del inmueble`);
        }
    }

    private async validarExisteInmueble(idInmueble: number) {
        const inmueble = await this._daoInmueble.obtenerInmueblePorId(idInmueble)
        if (!inmueble) {
            throw new ErrorDeNegocio(`No se encontró ningún inmueble con el id ${idInmueble}`);
        }
        return inmueble
    }


    pagoRealizadoPorActualPropietario(idPropietario: number, idPagador: number) {
        return idPagador === idPropietario
    }




}
