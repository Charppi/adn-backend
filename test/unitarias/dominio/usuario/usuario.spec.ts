import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { ErrorLongitudInvalida } from 'src/dominio/errores/error-longitud-invalida';

describe('Usuario', () => {
  const _Usuario = Usuario as any;

  it('usuario con cedula menor que 7 debería retornar error', () => {
    return expect(
      async () => new _Usuario('Benito', 'Camelas', 123),
    ).rejects.toStrictEqual(
      new ErrorLongitudInvalida('La cedula debe tener por lo menos 7 dígitos'),
    );
  });

  it('usuario con cedula >= 7 debería crear bien', () => {
    const usuario = new _Usuario('Juanca', 'Galindo', 68296268);

    expect(usuario.nombre).toEqual('Juanca');
    expect(usuario.apellido).toEqual('Galindo');
    expect(usuario.cedula).toEqual(68296268);
  });
});
