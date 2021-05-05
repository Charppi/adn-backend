import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { ErrorLongitudInvalida } from 'src/dominio/errores/error-longitud-invalida';

describe('Usuario', () => {
  it('usuario con cedula menor que 7 debería retornar error', () => {
    try {
      new Usuario('Benito', 'Camelas', 123)
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorLongitudInvalida)
    }
  });

  it('Deberia crear un usuario cuya cédula sea mayor a 7 dígitos', () => {
    const usuario = new Usuario('Juanca', 'Galindo', 68296268);

    expect(usuario.nombre).toEqual('Juanca');
    expect(usuario.apellido).toEqual('Galindo');
    expect(usuario.cedula).toEqual(68296268);
  });
});
