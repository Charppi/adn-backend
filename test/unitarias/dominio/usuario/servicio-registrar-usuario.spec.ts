import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';

describe('Pruebas al servicio RegistrarUsuario', () => {
  let servicioRegistrarUsuario: ServicioRegistrarUsuario;
  let repositorioUsuario: SinonStubbedInstance<RepositorioUsuario>;
  let daoUsuario: SinonStubbedInstance<DaoUsuario>;

  beforeEach(() => {
    repositorioUsuario = createStubObj<RepositorioUsuario>(["guardar"]);
    daoUsuario = createStubObj<DaoUsuario>(["existeCedulaUsuario", "obtenerUsuarioId"])
    servicioRegistrarUsuario = new ServicioRegistrarUsuario(repositorioUsuario, daoUsuario);
  });

  it('Debería fallar si intenta crear un usuario que ya existe', async () => {
    daoUsuario.existeCedulaUsuario.returns(Promise.resolve(true));

    await expect(
      servicioRegistrarUsuario.ejecutar(new Usuario('Rosa', 'Melano', 1006453353)),
    ).rejects.toStrictEqual(new ErrorDeNegocio('El documento 1006453353 ya está registrado'));

  });

  it('Debería guardar el usuario', async () => {
    const usuario = new Usuario('Jose', 'Meleguindo Alcueyo', 70353283);
    daoUsuario.existeCedulaUsuario.returns(Promise.resolve(false));

    await servicioRegistrarUsuario.ejecutar(usuario);

    expect(repositorioUsuario.guardar.getCalls().length).toBe(1);
    expect(repositorioUsuario.guardar.calledWith(usuario)).toBeTruthy();
  });
});
