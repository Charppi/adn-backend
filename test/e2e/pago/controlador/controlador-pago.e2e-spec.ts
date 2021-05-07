import request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { FiltroExcepcionesDeNegocio } from 'src/infraestructura/excepciones/filtro-excepciones-negocio';
import { AppLogger } from 'src/infraestructura/configuracion/ceiba-logger.service';
import { createSandbox, SinonStubbedInstance } from 'sinon';
import { createStubObj } from '../../../util/create-object.stub';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { RepositorioPago } from 'src/dominio/pagos/puerto/repositorio/repositorio-pago';
import { DaoPago } from 'src/dominio/pagos/puerto/dao/dao-pago';
import { PagoControlador } from 'src/infraestructura/pagos/controlador/pago.controlador';
import { ServicioRegistrarPago } from 'src/dominio/pagos/servicio/servicio-registrar-pago';
import { servicioRegistrarPagoProveedor } from 'src/infraestructura/pagos/proveedor/servicio/servicio-registrar-pago-proveedor';
import { ManejadorRegistrarPago } from 'src/aplicacion/pagos/comando/registrar-pago.manejador';
import { ManejadorListarPagos } from 'src/aplicacion/pagos/consulta/listar-pagos.manejador';
import { ComandoRegistrarPago } from 'src/aplicacion/pagos/comando/registrar-pago.comando';
import { InmuebleProveedorModule } from 'src/infraestructura/inmueble/proveedor/inmueble-proveedor.module';
import { UsuarioProveedorModule } from 'src/infraestructura/usuario/proveedor/usuario-proveedor.module';
import { InmuebleDto } from 'src/aplicacion/inmueble/consulta/dto/inmueble.dto';
import moment from 'moment';

/**
 * Un sandbox es util cuando el módulo de nest se configura una sola vez durante el ciclo completo de pruebas
 * */
const sinonSandbox = createSandbox();

describe('Pruebas al controlador de pagos', () => {
    let app: INestApplication;
    let repositorioPago: SinonStubbedInstance<RepositorioPago>;
    let daoPago: SinonStubbedInstance<DaoPago>;
    let repositorioInmueble: SinonStubbedInstance<RepositorioInmueble>;
    let daoInmueble: SinonStubbedInstance<DaoInmueble>;

    /**
     * No Inyectar los módulos completos (Se trae TypeORM y genera lentitud al levantar la prueba, traer una por una las dependencias)
     **/
    beforeAll(async () => {
        repositorioInmueble = createStubObj<RepositorioInmueble>(["editar", "guardar", "asignarInmueble", "actualizarFechasDePago"], sinonSandbox);
        repositorioPago = createStubObj<RepositorioPago>(['guardar'], sinonSandbox);
        daoPago = createStubObj<DaoPago>(['listar', 'obtenerFechaUltimoPago', 'obtenerPagoPorId', 'obtenerTotalAbonosAnteriores'], sinonSandbox);
        daoInmueble = createStubObj<DaoInmueble>(["obtenerInmueblePorId", "existeDireccionInmueble", "existeInmueble", "listar"], sinonSandbox);
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
                { provide: RepositorioInmueble, useValue: repositorioInmueble },
                { provide: DaoInmueble, useValue: daoInmueble },
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

    it('Debería listar los pagos registrados', async () => {
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

        return await request(app.getHttpServer())
            .get('/pagos')
            .expect(HttpStatus.OK)
            .expect(pagos);
    });

    it(`Debería fallar al registrar un pago sin id de inmueble válido`, async () => {
        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(null))
        const data = {
            "idInmueble": 1,
            "valor": "250000",
            "idPagador": 1
        }
        const mensaje = `No se encontró ningún inmueble con el id ${data.idInmueble}`;

        const response = await request(app.getHttpServer())
            .post('/pagos')
            .send(data)
            .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message).toBe(mensaje);
    })

    it(`Debería fallar al registrar un pago con id de pagador diferente del propietario`, async () => {
        const data = {
            "idInmueble": 1,
            "valor": "250000",
            "idPagador": 1
        }
        const inmueble: InmuebleDto = {
            "id": 1,
            "direccion": "Calle 16 # 31 - 17",
            "valor": 250000,
            "fechaAsignacion": new Date(),
            "fechaInicioPago": new Date(),
            "fechaLimitePago": new Date(),
            "usuario": {
                "id": 2,
                "nombre": "Carlos",
                "apellido": "Mendez",
                "cedula": 1006453353,
            }
        }
        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(inmueble))

        const mensaje = `El usuario que intenta realizar el pago no es el propietario parcial del inmueble`;

        const response = await request(app.getHttpServer())
            .post('/pagos')
            .send(data)
            .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message).toBe(mensaje);
    })

    const inmueble: any = {
        "id": 1,
        "direccion": "Calle 16 # 31 - 17",
        "valor": "250000",
        "fechaAsignacion": new Date(),
        "fechaInicioPago": new Date(),
        "fechaLimitePago": new Date(),
        "usuarioId": 1,
        "usuario": {
            "id": 1,
            "nombre": "Carlos",
            "apellido": "Mendez",
            "cedula": 1006453353
        }
    }
    it('Debería fallar al registar un pago con mayor valor que el inmueble a pagar', async () => {

        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(inmueble))
        daoPago.obtenerTotalAbonosAnteriores.returns(Promise.resolve(0))

        const data: any = {
            "idInmueble": 1,
            "idPagador": 1,
            "valor": "10000000"
        }
        const mensaje = `El valor ingresado para pagar supera el valor del inmueble`;

        const response = await request(app.getHttpServer())
            .post('/pagos')
            .send(data)
            .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message).toBe(mensaje);
    });

    it('Debería fallar al registar un pago con abonos anteriores con mayor valor que el inmueble a pagar', async () => {

        const TOTAL_ABONADO = 10000
        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(inmueble))
        daoPago.obtenerTotalAbonosAnteriores.returns(Promise.resolve(TOTAL_ABONADO))

        const data: any = {
            "idInmueble": 1,
            "idPagador": 1,
            "valor": "10000000"
        }
        const mensaje = `La suma de los abonos mas el pago actual supera el valor del inmueble. Total abonado hasta ahora: $${TOTAL_ABONADO}`;

        const response = await request(app.getHttpServer())
            .post('/pagos')
            .send(data)
            .expect(HttpStatus.BAD_REQUEST);

        expect(response.body.message).toBe(mensaje);
    });

    it('Debería registrar el pago (Pago de contado)', async () => {

        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(inmueble))
        daoPago.obtenerTotalAbonosAnteriores.returns(Promise.resolve(0))

        const data: any = {
            "idInmueble": 1,
            "idPagador": 1,
            "valor": "250000"
        }
        const fechaInicioPagoFormateada = moment(inmueble.fechaInicioPago).format("YYYY-MM-DD")
        const fechaLimitePagoFormateada = moment(inmueble.fechaLimitePago).format("YYYY-MM-DD")
        const mensaje = `El pago del inmueble ubicado en la dirección ${inmueble.direccion}, por el periodo de ${fechaInicioPagoFormateada} hasta ${fechaLimitePagoFormateada} ha sido completado. Se han actualizado las fechas de pago para el siguiente corte. Muchas gracias por su transacción.`;

        const response = await request(app.getHttpServer())
            .post('/pagos')
            .send(data)
            .expect(HttpStatus.CREATED);

        expect(response.text).toBe(mensaje);
    });

    it('Debería registrar el primer abono', async () => {

        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(inmueble))
        daoPago.obtenerTotalAbonosAnteriores.returns(Promise.resolve(0))

        const data: any = {
            "idInmueble": 1,
            "idPagador": 1,
            "valor": "100000"
        }
        const fechaInicioPagoFormateada = moment(inmueble.fechaInicioPago).format("YYYY-MM-DD")
        const fechaLimitePagoFormateada = moment(inmueble.fechaLimitePago).format("YYYY-MM-DD")
        const mensaje = `El abono del inmueble ubicado en la dirección ${inmueble.direccion}, por el periodo de ${fechaInicioPagoFormateada} hasta ${fechaLimitePagoFormateada} ha sido recibido. Recuerde que aún queda un saldo bruto de $${inmueble.valor - Number(data.valor)}. Muchas gracias por su transacción.`;

        const response = await request(app.getHttpServer())
            .post('/pagos')
            .send(data)
            .expect(HttpStatus.CREATED);

        expect(response.text).toBe(mensaje);
    });

    it('Debería registrar el abono sin completar el pago', async () => {
        const TOTAL_ABONADO = 100000

        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(inmueble))
        daoPago.obtenerTotalAbonosAnteriores.returns(Promise.resolve(TOTAL_ABONADO))

        const data: any = {
            "idInmueble": 1,
            "idPagador": 1,
            "valor": "100000"
        }
        const fechaInicioPagoFormateada = moment(inmueble.fechaInicioPago).format("YYYY-MM-DD")
        const fechaLimitePagoFormateada = moment(inmueble.fechaLimitePago).format("YYYY-MM-DD")
        const mensaje = `El abono del inmueble ubicado en la dirección ${inmueble.direccion}, por el periodo de ${fechaInicioPagoFormateada} hasta ${fechaLimitePagoFormateada} ha sido recibido. Recuerde que aún queda un saldo bruto de $${inmueble.valor - (Number(data.valor) + TOTAL_ABONADO)}. Muchas gracias por su transacción.`;

        const response = await request(app.getHttpServer())
            .post('/pagos')
            .send(data)
            .expect(HttpStatus.CREATED);

        expect(response.text).toBe(mensaje);
    });

    it('Debería completar el pago junto con los abonos anteriores', async () => {
        const TOTAL_ABONADO = 100000

        daoInmueble.obtenerInmueblePorId.returns(Promise.resolve(inmueble))
        daoPago.obtenerTotalAbonosAnteriores.returns(Promise.resolve(TOTAL_ABONADO))

        const data: any = {
            "idInmueble": 1,
            "idPagador": 1,
            "valor": "150000"
        }
        const fechaInicioPagoFormateada = moment(inmueble.fechaInicioPago).format("YYYY-MM-DD")
        const fechaLimitePagoFormateada = moment(inmueble.fechaLimitePago).format("YYYY-MM-DD")
        const mensaje = `El pago del inmueble ubicado en la dirección ${inmueble.direccion}, por el periodo de ${fechaInicioPagoFormateada} hasta ${fechaLimitePagoFormateada} ha sido completado. Se han actualizado las fechas de pago para el siguiente corte. Muchas gracias por su transacción.`;

        const response = await request(app.getHttpServer())
            .post('/pagos')
            .send(data)
            .expect(HttpStatus.CREATED);

        expect(response.text).toBe(mensaje);
    });

});
