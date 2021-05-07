import request from 'supertest';
import { Test } from '@nestjs/testing';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { FiltroExcepcionesDeNegocio } from 'src/infraestructura/excepciones/filtro-excepciones-negocio';
import { AppLogger } from 'src/infraestructura/configuracion/ceiba-logger.service';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { InmuebleControlador } from 'src/infraestructura/inmueble/controlador/inmueble.controlador';
import { ServicioRegistrarInmueble } from 'src/dominio/inmueble/servicio/servicio-registrar-inmueble';
import { servicioRegistrarInmuebleProveedor } from 'src/infraestructura/inmueble/proveedor/servicio/servicio-registrar-inmueble.provider';
import { ServicioEditarInmueble } from 'src/dominio/inmueble/servicio/servicio-editar-inmueble';
import { servicioEditarInmuebleProveedor } from 'src/infraestructura/inmueble/proveedor/servicio/servicio-editar-inmueble.provider';
import { ServicioAsignarInmueble } from 'src/dominio/inmueble/servicio/servicio-asignar-inmueble';
import { servicioAsignarInmuebleProveedor } from 'src/infraestructura/inmueble/proveedor/servicio/servicio-asignar-inmueble.provider';
import { ManejadorAsignarInmueble } from 'src/aplicacion/inmueble/comando/asignar-inmueble.manejador';
import { ManejadorEditarInmueble } from 'src/aplicacion/inmueble/comando/editar-inmueble.manejador';
import { ManejadorRegistrarInmueble } from 'src/aplicacion/inmueble/comando/registrar-inmueble.manejador';
import { ManejadorListarInmuebles } from 'src/aplicacion/inmueble/consulta/listar-inmuebles.manejador';
import { ComandoRegistrarInmueble } from 'src/aplicacion/inmueble/comando/registrar-inmueble.comando';
import { VALOR_MINIMO_INMUEBLE } from 'src/dominio/inmueble/modelo/inmueble';

/**
 * Un sandbox es util cuando el módulo de nest se configura una sola vez durante el ciclo completo de pruebas
 * */
const sinonSandbox = createSandbox();

describe('Pruebas al controlador de inmueble', () => {
    let app: INestApplication;
    let repositorioInmueble: SinonStubbedInstance<RepositorioInmueble>;
    let daoInmueble: SinonStubbedInstance<DaoInmueble>;
    let daoUsuario: SinonStubbedInstance<DaoUsuario>
    /**
     * No Inyectar los módulos completos (Se trae TypeORM y genera lentitud al levantar la prueba, traer una por una las dependencias)
     **/
    beforeAll(async () => {
        repositorioInmueble = createStubObj<RepositorioInmueble>(
            ["guardar", "asignarInmueble", "actualizarFechasDePago", "editar"],
            sinonSandbox,
        );
        daoUsuario = createStubObj<DaoUsuario>(["existeCedulaUsuario", "listar", "obtenerUsuarioId"], sinonSandbox)
        daoInmueble = createStubObj<DaoInmueble>(["listar", "existeDireccionInmueble", "existeInmueble", "obtenerInmueblePorId", "totalInmuebles"], sinonSandbox);
        const moduleRef = await Test.createTestingModule({
            controllers: [InmuebleControlador],
            providers: [
                AppLogger,
                {
                    provide: ServicioRegistrarInmueble,
                    inject: [RepositorioInmueble, DaoInmueble],
                    useFactory: servicioRegistrarInmuebleProveedor,
                },
                {
                    provide: ServicioEditarInmueble,
                    inject: [RepositorioInmueble, DaoInmueble],
                    useFactory: servicioEditarInmuebleProveedor,
                },
                {
                    provide: ServicioAsignarInmueble,
                    inject: [RepositorioInmueble, DaoInmueble, DaoUsuario],
                    useFactory: servicioAsignarInmuebleProveedor,
                },
                { provide: RepositorioInmueble, useValue: repositorioInmueble },
                { provide: DaoInmueble, useValue: daoInmueble },
                { provide: DaoUsuario, useValue: daoUsuario },
                ManejadorAsignarInmueble,
                ManejadorEditarInmueble,
                ManejadorRegistrarInmueble,
                ManejadorListarInmuebles
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        const logger = await app.resolve(AppLogger);
        logger.customError = sinonSandbox.stub();
        app.useGlobalFilters(new FiltroExcepcionesDeNegocio(logger));
        await app.init();
    });

    afterEach(() => {
        sinonSandbox.restore();
    });

    afterAll(async () => {
        await app.close();
    });

    const inmueble: ComandoRegistrarInmueble = {
        direccion: "Calle 17 # 31 - 17",
        valor: 150000
    };

    it('Debería listar los inmuebles registrados', () => {
        const inmuebles: any = [
            {
                "id": 1,
                "direccion": "Calle 16 # 31 - 17",
                "valor": 250000,
                "fechaAsignacion": "2021-05-04T14:38:51.000Z",
                "fechaInicioPago": "2021-05-04T14:38:51.000Z",
                "fechaLimitePago": "2021-06-04T14:38:51.000Z",
                "usuarioId": 1
            }
        ];
        const data: any = { inmuebles }
        daoInmueble.listar.returns(Promise.resolve(inmuebles));

        return request(app.getHttpServer())
            .get('/inmuebles')
            .expect(HttpStatus.OK)
            .expect(data);
    });

    it('Debería registar un inmueble', async () => {
        await request(app.getHttpServer())
            .post('/inmuebles')
            .send(inmueble)
            .expect(HttpStatus.CREATED);
    });

    it('Debería fallar al registar un inmueble con una direccion existente', async () => {

        daoInmueble.existeDireccionInmueble.returns(Promise.resolve(true))

        const mensaje = `Ya existe un inmueble para la dirección ${inmueble.direccion}`;
        const response = await request(app.getHttpServer())
            .post('/inmuebles')
            .send(inmueble);

        expect(response.body.message).toBe(mensaje);
        expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('Debería fallar al asignar un inmueble con un id de inmueble no válido', async () => {
        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(null))
        const data = {
            "id": 1,
            "idUsuarioAsignado": 1
        }
        const mensaje = `No existe un inmueble con el identificador ${data.id}`;
        const response = await request(app.getHttpServer())
            .put('/inmuebles/asignar')
            .send(data);

        expect(response.body.message).toBe(mensaje);
        expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
    })

    it('Debería fallar al asignar un inmueble con un id de usuario no válido', async () => {
        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(inmueble))
        daoUsuario.obtenerUsuarioId.returns(Promise.resolve(null))
        const data = {
            "id": 1,
            "idUsuarioAsignado": 1
        }
        const mensaje = `No se encontró un usuario con el id ${data.idUsuarioAsignado}`;
        const response = await request(app.getHttpServer())
            .put('/inmuebles/asignar')
            .send(data);

        expect(response.body.message).toBe(mensaje);
        expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
    })

    it(`Debería fallar al registar un inmueble con un valor menor al límite (actualmente $${VALOR_MINIMO_INMUEBLE})`, async () => {
        const inmueble = {
            "direccion": "Calle 16 lll# 31 - 17",
            "valor": VALOR_MINIMO_INMUEBLE - 1
        }
        const mensaje = `El valor mínimo de un inmueble es de ${VALOR_MINIMO_INMUEBLE}`;
        const response = await request(app.getHttpServer())
            .post('/inmuebles')
            .send(inmueble)
        expect(response.body.message).toBe(mensaje);
        expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
});
