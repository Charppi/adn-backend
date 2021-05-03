import request from 'supertest';
import { Test } from '@nestjs/testing';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { FiltroExcepcionesDeNegocio } from 'src/infraestructura/excepciones/filtro-excepciones-negocio';
import { UsuarioControlador } from 'src/infraestructura/usuario/controlador/usuario.controlador';
import { ServicioRegistrarUsuario } from 'src/dominio/usuario/servicio/servicio-registrar-usuario';
import { servicioRegistrarUsuarioProveedor } from 'src/infraestructura/usuario/proveedor/servicio/servicio-registrar-usuario.proveedor';
import { ManejadorRegistrarUsuario } from 'src/aplicacion/usuario/comando/registar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/aplicacion/usuario/consulta/listar-usuarios.manejador';
import { ComandoRegistrarUsuario } from 'src/aplicacion/usuario/comando/registrar-usuario.comando';
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
import { RepositorioPago } from 'src/dominio/pagos/puerto/repositorio/repositorio-pago';
import { DaoPago } from 'src/dominio/pagos/puerto/dao/dao-pago';
import { PagoControlador } from 'src/infraestructura/pagos/controlador/pago.controlador';
import { ServicioRegistrarPago } from 'src/dominio/pagos/servicio/servicio-registrar-pago';
import { servicioRegistrarPagoProveedor } from 'src/infraestructura/pagos/proveedor/servicio/servicio-registrar-pago-proveedor';
import { ManejadorRegistrarPago } from 'src/aplicacion/pagos/comando/registrar-pago.manejador';
import { ManejadorListarPagos } from 'src/aplicacion/pagos/consulta/listar-pagos.manejador';
import { ComandoRegistrarPago } from 'src/aplicacion/pagos/comando/registrar-pago.comando';

/**
 * Un sandbox es util cuando el módulo de nest se configura una sola vez durante el ciclo completo de pruebas
 * */
const sinonSandbox = createSandbox();

describe('Pruebas al controlador de pagos', () => {
    let app: INestApplication;
    let repositorioPago: SinonStubbedInstance<RepositorioPago>;
    let daoPago: SinonStubbedInstance<DaoPago>;

    /**
     * No Inyectar los módulos completos (Se trae TypeORM y genera lentitud al levantar la prueba, traer una por una las dependencias)
     **/
    beforeAll(async () => {
        repositorioPago = createStubObj<RepositorioPago>(
            ['guardar'],
            sinonSandbox,
        );
        daoPago = createStubObj<DaoPago>(['listar', 'obtenerFechaUltimoPago', 'obtenerPagoPorId', 'obtenerTotalAbonosAnteriores'], sinonSandbox);
        const moduleRef = await Test.createTestingModule({
            controllers: [PagoControlador],
            providers: [
                AppLogger,
                {
                    provide: ServicioRegistrarPago,
                    inject: [RepositorioPago, RepositorioInmueble, DaoInmueble, DaoPago],
                    useFactory: servicioRegistrarPagoProveedor,
                },
                { provide: RepositorioPago, useValue: repositorioPago },
                { provide: DaoPago, useValue: daoPago },
                ManejadorRegistrarPago,
                ManejadorListarPagos
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

    it('debería listar los pagos registrados', () => {
        const pagos: any[] = [
            {
                "id": 1,
                "valor": 200000,
                "cargo": -145000,
                "total": 0,
                "fechaPago": "2021-04-30T09:38:27.000Z",
                "desde": "2021-04-30T09:37:57.000Z",
                "hasta": "2021-05-30T09:37:57.000Z",
                "usuarioId": 1,
                "inmuebleId": 1
            }
        ];
        daoPago.listar.returns(Promise.resolve(pagos));

        return request(app.getHttpServer())
            .get('/pagos')
            .expect(HttpStatus.OK)
            .expect(pagos);
    });

    it('debería fallar al registar un pago con mayor valor que el inmueble a pagar', async () => {
        const inmueble: ComandoRegistrarPago = {
            "idInmueble": 2,
            "idPagador": 1,
            "valor": 10000000
        }
        const mensaje = `La suma de los abonos mas el pago actual supera el valor del inmueble. Total abonado hasta ahora: $80000`;

        const response = await request(app.getHttpServer())
            .post('/inmuebles')
            .send(inmueble)
            .expect(HttpStatus.BAD_REQUEST);
        expect(response.body.message).toBe(mensaje);
        expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
});
