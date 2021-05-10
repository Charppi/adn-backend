import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { ErrorDeNegocio } from 'src/dominio/errores/error-de-negocio';
import { ServicioEditarUsuario } from 'src/dominio/usuario/servicio/serrvicio-editar-usuario';

describe('Pruebas al servicio de editar usuario', () => {
    let servicioEditarUsuario: ServicioEditarUsuario;
    let repositorioUsuario: SinonStubbedInstance<RepositorioUsuario>;
    let daoUsuario: SinonStubbedInstance<DaoUsuario>;

    beforeEach(() => {
        repositorioUsuario = createStubObj<RepositorioUsuario>(["guardar"]);
        daoUsuario = createStubObj<DaoUsuario>(["existeCedulaUsuario",
            "obtenerUsuarioId", "existeCedulaUsuarioDiferente"])
        servicioEditarUsuario = new ServicioEditarUsuario(repositorioUsuario, daoUsuario);
    });

    it('Debería fallar si intenta cambiar la cédula a una ya registrada', async () => {
        const usuario = {
            id: 1,
            nombre: "Carlos",
            apellido: "Mendez",
            cedula: 1006453353
        }
        daoUsuario.existeCedulaUsuarioDiferente.returns(Promise.resolve(usuario));

        await expect(
            servicioEditarUsuario.ejecutar(new Usuario('Carlos', 'Mendez', 1006453353, 1)),
        ).rejects.toStrictEqual(
            new ErrorDeNegocio('El documento 1006453353 ya está registrado')
        );

    });

    it('Debería guardar el usuario', async () => {

        const usuario = new Usuario("Carlos Alvis", "Mendez", 1006453353, 1);
        daoUsuario.existeCedulaUsuarioDiferente.returns(Promise.resolve(null));

        await servicioEditarUsuario.ejecutar(usuario);

        expect(repositorioUsuario.guardar.getCalls().length).toBe(1);
        expect(repositorioUsuario.guardar.calledWith(usuario)).toBeTruthy();
    });
});
