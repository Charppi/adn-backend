import { ServicioRegistrarInmueble } from 'src/dominio/inmueble/servicio/servicio-registrar-inmueble';
import { Inmueble, VALOR_MINIMO_INMUEBLE } from 'src/dominio/inmueble/modelo/inmueble';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';

describe('Pruebas al servicio de registro de inmuebles', () => {
  let servicioRegistrarInmueble: ServicioRegistrarInmueble;
  let repositorioInmueble: SinonStubbedInstance<RepositorioInmueble>;
  let daoInmueble: SinonStubbedInstance<DaoInmueble>;

  beforeEach(() => {
    repositorioInmueble = createStubObj<RepositorioInmueble>([
      "actualizarFechasDePago",
      "asignarInmueble",
      "guardar",
      "editar"
    ]);
    daoInmueble = createStubObj<DaoInmueble>(["existeDireccionInmueble", "existeInmueble"])
    servicioRegistrarInmueble = new ServicioRegistrarInmueble(repositorioInmueble, daoInmueble);
  });

  it("Debería fallar si encuentra un inmueble con una dirección ya registrada", async () => {
    daoInmueble.existeDireccionInmueble.returns(Promise.resolve(true));
    try {
      await servicioRegistrarInmueble.ejecutar(new Inmueble("Calle 123", VALOR_MINIMO_INMUEBLE))
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorDeNegocio)
    }
  })

  it("Debería registrar el inmueble", async () => {
    const inmueble = new Inmueble("Calle 123", VALOR_MINIMO_INMUEBLE)
    await servicioRegistrarInmueble.ejecutar(inmueble)
    expect(repositorioInmueble.guardar.getCalls().length).toBe(1)
    expect(repositorioInmueble.guardar.calledWith(inmueble)).toBeTruthy();
  })

});
