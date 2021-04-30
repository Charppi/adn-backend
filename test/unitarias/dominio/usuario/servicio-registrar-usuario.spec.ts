import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';

describe('ServicioRegistrarUsuario', () => {
  let servicioRegistrarUsuario: ServicioRegistrarUsuario;
  let repositorioUsuarioStub: SinonStubbedInstance<RepositorioUsuario>;

  beforeEach(() => {
    repositorioUsuarioStub = createStubObj<RepositorioUsuario>([
      'obtenerUsuarioId',
      'guardar',
      'existeCedulaUsuario'
    ]);
    servicioRegistrarUsuario = new ServicioRegistrarUsuario(
      repositorioUsuarioStub,
    );
  });

  it('si la cedula de usuario ya existe no se puede crear y deberia retonar error', async () => {
    repositorioUsuarioStub.existeCedulaUsuario.returns(Promise.resolve(true));

    await expect(
      servicioRegistrarUsuario.ejecutar(
        new Usuario('Rosa', 'Melano', 1006453353),
      ),
    ).rejects.toThrow('El documento 1006453353 ya está registrado');
  });

  it('si la cedula no existe guarda el usuario el repositorio', async () => {
    const usuario = new Usuario('Jose', 'Meleguindo Alcueyo', 70353283);
    repositorioUsuarioStub.existeCedulaUsuario.returns(Promise.resolve(false));

    await servicioRegistrarUsuario.ejecutar(usuario);

    expect(repositorioUsuarioStub.guardar.getCalls().length).toBe(1);
    expect(repositorioUsuarioStub.guardar.calledWith(usuario)).toBeTruthy();
  });
});
