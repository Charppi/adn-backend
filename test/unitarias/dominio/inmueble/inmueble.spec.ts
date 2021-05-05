import { ErrorValorMinimo } from "src/dominio/errores/error-valor-minimo"
import { Inmueble, VALOR_MINIMO_INMUEBLE } from "src/dominio/inmueble/modelo/inmueble"

describe("Inmueble", () => {
    it(`Debería fallar cuando intente crear un inmueble con valor menor a ${VALOR_MINIMO_INMUEBLE}`, () => {
        try {
            new Inmueble("Calle 123", VALOR_MINIMO_INMUEBLE - 1)
        } catch (error) {
            expect(error).toBeInstanceOf(ErrorValorMinimo)
        }
    })

    it(`Debería crear el inmueble`, () => {
        const data = { direccion: "Calle 123", valor: VALOR_MINIMO_INMUEBLE };
        const inmueble = new Inmueble(data.direccion, data.valor);
        expect(inmueble.direccion).toEqual(data.direccion);
        expect(inmueble.valor).toEqual(data.valor);
    })
})