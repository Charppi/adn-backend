import request from 'supertest';
import { Test } from '@nestjs/testing';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
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

/**
 * Un sandbox es util cuando el módulo de nest se configura una sola vez durante el ciclo completo de pruebas
 * */
const sinonSandbox = createSandbox();

describe('Pruebas al controlador de usuarios', () => {
  let app: INestApplication;
  let repositorioUsuario: SinonStubbedInstance<RepositorioUsuario>;
  let daoUsuario: SinonStubbedInstance<DaoUsuario>;

  /**
   * No Inyectar los módulos completos (Se trae TypeORM y genera lentitud al levantar la prueba, traer una por una las dependencias)
   **/
  beforeAll(async () => {
    repositorioUsuario = createStubObj<RepositorioUsuario>(
      ['guardar'],
      sinonSandbox,
    );
    daoUsuario = createStubObj<DaoUsuario>(["listar", "existeCedulaUsuario", "obtenerUsuarioId"], sinonSandbox);
    const moduleRef = await Test.createTestingModule({
      controllers: [UsuarioControlador],
      providers: [
        AppLogger,
        {
          provide: ServicioRegistrarUsuario,
          inject: [RepositorioUsuario, DaoUsuario],
          useFactory: servicioRegistrarUsuarioProveedor,
        },
        { provide: RepositorioUsuario, useValue: repositorioUsuario },
        { provide: DaoUsuario, useValue: daoUsuario },
        ManejadorRegistrarUsuario,
        ManejadorListarUsuario,
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

  it('Debería listar los usuarios registrados', () => {
    const usuarios: any[] = [
      {
        "id": 1,
        "nombre": "Carlos",
        "apellido": "Mendez",
        "cedula": 1006453353,
        "fechaCreacion": "2021-05-04T14:29:03.000Z"
      }
    ]
    daoUsuario.listar.returns(Promise.resolve(usuarios));

    return request(app.getHttpServer())
      .get('/usuarios')
      .expect(HttpStatus.OK)
      .expect(usuarios);
  });

  it('Debería fallar al registar un usuario con cedula muy corta', async () => {
    const usuario: ComandoRegistrarUsuario = {
      nombre: "Carlos",
      apellido: "Mendez",
      cedula: 123
    };
    const mensaje = 'La cedula debe tener por lo menos 7 dígitos';

    const response = await request(app.getHttpServer())
      .post('/usuarios')
      .send(usuario)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Debería fallar al registar un usuario ya existente', async () => {
    const usuario: ComandoRegistrarUsuario = {
      nombre: 'Lorem ipsum',
      apellido: "",
      cedula: 12312312,
    };
    const mensaje = `El documento ${usuario.cedula} ya está registrado`;
    daoUsuario.existeCedulaUsuario.returns(Promise.resolve(true));

    const response = await request(app.getHttpServer())
      .post('/usuarios')
      .send(usuario)
      .expect(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe(mensaje);
    expect(response.body.statusCode).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Debería crear al usuario', async () => {
    const usuario: ComandoRegistrarUsuario = {
      "nombre": "Carlos",
      "apellido": "Mendez",
      "cedula": 1006453353
    }

    daoUsuario.existeCedulaUsuario.returns(Promise.resolve(false))

    await request(app.getHttpServer())
      .post('/usuarios')
      .send(usuario)
      .expect(HttpStatus.CREATED);
  });

});
