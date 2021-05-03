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

/**
 * Un sandbox es util cuando el módulo de nest se configura una sola vez durante el ciclo completo de pruebas
 * */
const sinonSandbox = createSandbox();

describe('Pruebas al controlador de inmueble', () => {
    let app: INestApplication;
    let repositorioInmueble: SinonStubbedInstance<RepositorioInmueble>;
    let daoInmueble: SinonStubbedInstance<DaoInmueble>;

    /**
     * No Inyectar los módulos completos (Se trae TypeORM y genera lentitud al levantar la prueba, traer una por una las dependencias)
     **/
    beforeAll(async () => {
        repositorioInmueble = createStubObj<RepositorioInmueble>(
            ['guardar'],
            sinonSandbox,
        );
        daoInmueble = createStubObj<DaoInmueble>(['listar'], sinonSandbox);
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
                    inject: [RepositorioInmueble, DaoInmueble],
                    useFactory: servicioAsignarInmuebleProveedor,
                },
                { provide: RepositorioInmueble, useValue: repositorioInmueble },
                { provide: DaoInmueble, useValue: daoInmueble },
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

    it('debería listar los inmuebles registrados', () => {
        const inmuebles: any[] = [
            {
                id: 1,
                direccion: 'Lorem ipsum',
                valor: 150290,
                fechaAsignacion: new Date().toDateString(),
                fechaInicioPago: new Date().toISOString(),
                fechaLimitePago: new Date().toISOString(),
                usuarioId: 1
            },
        ];
        daoInmueble.listar.returns(Promise.resolve(inmuebles));

        return request(app.getHttpServer())
            .get('/inmuebles')
            .expect(HttpStatus.OK)
            .expect(inmuebles);
    });

    it('debería fallar al registar un inmueble con una direccion existente', async () => {
        const inmueble: ComandoRegistrarInmueble = {
            direccion: "Calle 17 # 31 - 17",
            valor: 150000
        };
        const mensaje = `Ya existe un inmueble para la dirección ${inmueble.direccion}`;

        const response = await request(app.getHttpServer())
            .post('/inmuebles')
            .send(inmueble)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toBe(mensaje);
        expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('debería fallar al registar un inmueble con un valor menor al límite (actualmente $150.000)', async () => {
        const inmueble: ComandoRegistrarInmueble = {
            direccion: "Calle 17 # 31 - 17",
            valor: 140000
        };
        const mensaje = `El valor mínimo de un inmueble es de ${inmueble.valor}`;
        const response = await request(app.getHttpServer())
            .post('/inmuebles')
            .send(inmueble)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toBe(mensaje);
        expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
});
