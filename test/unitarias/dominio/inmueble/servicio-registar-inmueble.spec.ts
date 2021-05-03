import { ServicioRegistrarInmueble } from 'src/dominio/inmueble/servicio/servicio-registrar-inmueble';
import { Inmueble } from 'src/dominio/inmueble/modelo/inmueble';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';

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
    servicioRegistrarInmueble = new ServicioRegistrarInmueble(
      repositorioInmuebleStub, daoInmueble
    );
  });

  // it('si la cedula de usuario ya existe no se puede crear y deberia retonar error', async () => {
  //   repositorioInmuebleStub.existeDireccionInmueble.returns(Promise.resolve(true));

  //   await expect(
  //     servicioRegistrarInmueble.ejecutar(
  //       new Inmueble('Rosa', 'Melano', 1006453353),
  //     ),
  //   ).rejects.toThrow('El documento 1006453353 ya está registrado');
  // });

  // it('si la cedula no existe guarda el usuario el repositorio', async () => {
  //   const usuario = new Inmueble('Jose', 'Meleguindo Alcueyo', 70353283);
  //   repositorioInmuebleStub.existeInmueble.returns(Promise.resolve(false));

  //   await servicioRegistrarInmueble.ejecutar(usuario);

  //   expect(repositorioInmuebleStub.guardar.getCalls().length).toBe(1);
  //   expect(repositorioInmuebleStub.guardar.calledWith(usuario)).toBeTruthy();
  // });
});
