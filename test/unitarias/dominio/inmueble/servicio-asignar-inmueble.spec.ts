import { SinonStubbedInstance } from "sinon"
import { InmuebleDto } from "src/aplicacion/inmueble/consulta/dto/inmueble.dto"
import { UsuarioDto } from "src/aplicacion/usuario/consulta/dto/usuario.dto"
import { ErrorDeNegocio } from "src/dominio/errores/error-de-negocio"
import { VALOR_MINIMO_INMUEBLE } from "src/dominio/inmueble/modelo/inmueble"
import { DaoInmueble } from "src/dominio/inmueble/puerto/dao/dao-inmueble"
import { RepositorioInmueble } from "src/dominio/inmueble/puerto/repositorio/respositorio-inmueble"
import { ServicioAsignarInmueble } from "src/dominio/inmueble/servicio/servicio-asignar-inmueble"
import { DaoUsuario } from "src/dominio/usuario/puerto/dao/dao-usuario"
import { createStubObj } from "test/util/create-object.stub"

describe("Pruebas al servicio de asignar inmuebles", () => {
    let servicioAsignarInmueble: ServicioAsignarInmueble;
    let repositorioInmueble: SinonStubbedInstance<RepositorioInmueble>;
    let daoInmueble: SinonStubbedInstance<DaoInmueble>;
    let daoUsuario: SinonStubbedInstance<DaoUsuario>;

    beforeEach(() => {
        repositorioInmueble = createStubObj<RepositorioInmueble>(["actualizarFechasDePago", "asignarInmueble", "editar", "guardar"]);
        daoInmueble = createStubObj<DaoInmueble>(["existeDireccionInmueble", "existeInmueble", "listar", "obtenerInmueblePorId"]);
        daoUsuario = createStubObj<DaoUsuario>(["existeCedulaUsuario", "listar", "obtenerUsuarioId"]);
        servicioAsignarInmueble = new ServicioAsignarInmueble(repositorioInmueble, daoInmueble, daoUsuario);
    })

    it("Debería fallar si no existe el inmueble", async () => {
        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(null));
        try {
            await servicioAsignarInmueble.ejecutar(1, 1)
        } catch (error) {
            expect(error).toBeInstanceOf(ErrorDeNegocio)
        }
    })

    it("Debería fallar si no existe el usuario a asignar", async () => {
        const inmueble: InmuebleDto = { direccion: "Calle 123", valor: VALOR_MINIMO_INMUEBLE }
        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(inmueble));
        daoUsuario.obtenerUsuarioId.returns(Promise.resolve(null));
        try {
            await servicioAsignarInmueble.ejecutar(1, 1)
        } catch (error) {
            expect(error).toBeInstanceOf(ErrorDeNegocio)
        }
    })

    it("Debería asignar el inmueble", async () => {
        const data: InmuebleDto = { direccion: "Calle 123", valor: VALOR_MINIMO_INMUEBLE, id: 1 };
        const usuario: UsuarioDto = {
            "id": 1,
            "nombre": "Carlos",
            "apellido": "Mendez",
            "cedula": 1006453353
        }
        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(data));
        daoUsuario.obtenerUsuarioId.returns(Promise.resolve(usuario))

        await servicioAsignarInmueble.ejecutar(1, 1);
        expect(repositorioInmueble.asignarInmueble.getCalls().length).toBe(1);
        expect(repositorioInmueble.asignarInmueble.calledWith(data.id, usuario.id)).toBeTruthy();
    })

})