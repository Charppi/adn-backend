import moment from "moment"
import { ErrorTotalAPagarMenorQueValorInmueble } from "src/dominio/errores/error-de-valor-a-pagar-menor-que-valor-inmueble"
import { VALOR_MINIMO_INMUEBLE } from "src/dominio/inmueble/modelo/inmueble"
import { CARGO_POR_DIA_VENCIDO, Pago } from "src/dominio/pagos/modelo/pago"

describe("Pruebas al modelo de Pago", () => {
    const data = {
        "desde": new Date("2021-05-01"),
        "hasta": new Date("2021-05-31"),
        "valor": -VALOR_MINIMO_INMUEBLE,
        "usuarioId": 1,
        "inmuebleId": 1,
        "pagosAnteriores": 0,
        "fechaLimite": new Date("2021-05-31"),
        "valorInmueble": VALOR_MINIMO_INMUEBLE
    }

    it("Debería fallar si el valor a pagar es mayor al valor del inmueble", async () => {
        try {
            new Pago(
                data.desde,
                data.hasta,
                data.valor,
                data.usuarioId,
                data.inmuebleId,
                data.pagosAnteriores,
                data.fechaLimite,
                data.valorInmueble
            );
        } catch (error) {
            expect(error).toBeInstanceOf(ErrorTotalAPagarMenorQueValorInmueble)
        }
    });

    it("Debería crear la instancia del pago", () => {
        data.valor = VALOR_MINIMO_INMUEBLE;
        const pago = new Pago(
            data.desde,
            data.hasta,
            data.valor,
            data.usuarioId,
            data.inmuebleId,
            data.pagosAnteriores,
            data.fechaLimite,
            data.valorInmueble
        );
        expect(pago).toBeInstanceOf(Pago)
    })
});