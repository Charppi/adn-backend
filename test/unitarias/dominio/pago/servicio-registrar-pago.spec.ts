import { SinonStubbedInstance } from "sinon";
import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio";
import { DaoInmueble } from "src/dominio/inmueble/puerto/dao/dao-inmueble";
import { RepositorioInmueble } from "src/dominio/inmueble/puerto/repositorio/respositorio-inmueble";
import { DaoPago } from "src/dominio/pagos/puerto/dao/dao-pago";
import { RepositorioPago } from "src/dominio/pagos/puerto/repositorio/repositorio-pago";
import { ServicioRegistrarPago } from "src/dominio/pagos/servicio/servicio-registrar-pago"
import { createStubObj } from "test/util/create-object.stub";

describe("Pruebas al servicio de registrar pagos", () => {
    let servicioRegistrarPago: ServicioRegistrarPago;
    let repositorioPago: SinonStubbedInstance<RepositorioPago>
    let repositorioInmuble: SinonStubbedInstance<RepositorioInmueble>;
    let daoInmueble: SinonStubbedInstance<DaoInmueble>;
    let daoPago: SinonStubbedInstance<DaoPago>;

    beforeEach(() => {
        repositorioInmuble = createStubObj<RepositorioInmueble>(["actualizarFechasDePago", "asignarInmueble", "editar", "guardar"]);
        repositorioPago = createStubObj<RepositorioPago>(["guardar"]);
        daoInmueble = createStubObj<DaoInmueble>(["existeDireccionInmueble", "existeInmueble", "listar", "obtenerInmueblePorId"]);
        daoPago = createStubObj<DaoPago>(["listar", "obtenerFechaUltimoPago", "obtenerPagoPorId", "obtenerTotalAbonosAnteriores"]);
        servicioRegistrarPago = new ServicioRegistrarPago(repositorioPago, repositorioInmuble, daoInmueble, daoPago)
    })

    it("Debería fallar si no existe un inmueble", async () => {
        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(null));
        const data = { "idInmueble": 1, "valor": 2500000, "idPagador": 1 };
        try {
            await servicioRegistrarPago.ejecutar(data.idInmueble, data.idPagador, data.valor);
        } catch (error) {
            expect(error).toBeInstanceOf(ErrorDeNegocio);
        }
    })

    it("Debería fallar si el usuario que realiza el pago no es el propietario", async () => {
        const data = {
            "idInmueble": 1,
            "valor": 250000,
            "idPagador": 1
        }
        const inmueble = {
            "id": 1,
            "direccion": "Calle 16 # 31 - 17",
            "valor": 250000,
            "fechaAsignacion": new Date(),
            "fechaInicioPago": new Date(),
            "fechaLimitePago": new Date(),
            "usuario": {
                "id": 2,
                "nombre": "Carlos",
                "apellido": "Mendez",
                "cedula": 1006453353,
            }
        }
        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(inmueble));
        try {
            await servicioRegistrarPago.ejecutar(data.idInmueble, data.idPagador, data.valor);
        } catch (error) {
            expect(error).toBeInstanceOf(ErrorDeNegocio);
        }
    })

    it("Debería realizar el pago", async () => {
        const data = {
            "idInmueble": 1,
            "valor": 250000,
            "idPagador": 1
        }
        const inmueble = {
            "id": 1,
            "direccion": "Calle 16 # 31 - 17",
            "valor": 250000,
            "fechaAsignacion": new Date(),
            "fechaInicioPago": new Date(),
            "fechaLimitePago": new Date(),
            "usuario": {
                "id": 1,
                "nombre": "Carlos",
                "apellido": "Mendez",
                "cedula": 1006453353,
            }
        }
        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(inmueble));
        await servicioRegistrarPago.ejecutar(data.idInmueble, data.idPagador, data.valor);
        expect(repositorioPago.guardar.getCalls().length).toBe(1)
    })

})