import { ServicioRegistrarInmueble } from 'src/dominio/inmueble/servicio/servicio-registrar-inmueble';
import { Inmueble, VALOR_MINIMO_INMUEBLE } from 'src/dominio/inmueble/modelo/inmueble';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { ErrorValorMinimo } from 'src/dominio/errores/error-valor-minimo';

describe('ServicioRegistrarInmueble', () => {
  let servicioRegistrarInmueble: ServicioRegistrarInmueble;
  let repositorioInmuebleStub: SinonStubbedInstance<RepositorioInmueble>;
  let daoInmueble: SinonStubbedInstance<DaoInmueble>

  beforeEach(() => {
    repositorioInmuebleStub = createStubObj<RepositorioInmueble>([
      "actualizarFechasDePago",
      'asignarInmueble',
      "guardar",
      'editar'
    ]);
    daoInmueble = createStubObj<DaoInmueble>(["existeDireccionInmueble", "existeInmueble"])
    servicioRegistrarInmueble = new ServicioRegistrarInmueble(
      repositorioInmuebleStub, daoInmueble
    );
  });


  it(`Debería fallar si se envía un valor menor a ${VALOR_MINIMO_INMUEBLE}`, async () => {
    await expect(
      servicioRegistrarInmueble.ejecutar(
        new Inmueble("Calle 123", VALOR_MINIMO_INMUEBLE - 1)
      )
    ).rejects.toStrictEqual(
      new ErrorValorMinimo(`El valor mínimo de un inmueble es de ${VALOR_MINIMO_INMUEBLE}`),
    )

  })

  it('Debería fallar si encuentra un inmueble con una dirección ya registrada', async () => {
    daoInmueble.existeDireccionInmueble.returns(Promise.resolve(true));

    const direccion = "Calle 123"

    await expect(
      servicioRegistrarInmueble.ejecutar(
        new Inmueble(direccion, VALOR_MINIMO_INMUEBLE)
      )
    ).rejects.toThrow(`Ya existe un inmueble para la dirección ${direccion}`)

  })
});
