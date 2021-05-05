import { SinonStubbedInstance } from "sinon";
import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio";
import { Inmueble, VALOR_MINIMO_INMUEBLE } from "src/dominio/inmueble/modelo/inmueble";
import { DaoInmueble } from "src/dominio/inmueble/puerto/dao/dao-inmueble";
import { RepositorioInmueble } from "src/dominio/inmueble/puerto/repositorio/respositorio-inmueble";
import { ServicioEditarInmueble } from "src/dominio/inmueble/servicio/servicio-editar-inmueble"
import { createStubObj } from "test/util/create-object.stub";

describe("Pruebas a el servicio de editar inmueble", () => {
    let servicioEditarInmueble: ServicioEditarInmueble;
    let repositorioInmueble: SinonStubbedInstance<RepositorioInmueble>;
    let daoInmueble: SinonStubbedInstance<DaoInmueble>;

    beforeEach(() => {
        repositorioInmueble = createStubObj<RepositorioInmueble>(["actualizarFechasDePago", "editar", "asignarInmueble", "guardar"]);
        daoInmueble = createStubObj<DaoInmueble>(["existeDireccionInmueble", "existeInmueble", "listar", "obtenerInmueblePorId"]);
        servicioEditarInmueble = new ServicioEditarInmueble(repositorioInmueble, daoInmueble)
    })

    it("Debería fallar si no existe el inmueble", async () => {
        daoInmueble.existeInmueble.returns(Promise.resolve(false));
        try {
            await servicioEditarInmueble.ejecutar(new Inmueble("Calle 123", VALOR_MINIMO_INMUEBLE, 15))
        } catch (error) {
            expect(error).toBeInstanceOf(ErrorDeNegocio)
        }
    })

    it("Debería editar el inmueble", async () => {
        const inmueble = new Inmueble("Calle 123", VALOR_MINIMO_INMUEBLE, 1)
        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(inmueble));
        await servicioEditarInmueble.ejecutar(inmueble)
        expect(repositorioInmueble.editar.getCalls().length).toBe(1)
        expect(repositorioInmueble.editar.calledWith(inmueble)).toBeTruthy();

    })
})