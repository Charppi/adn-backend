import { ApiProperty } from '@nestjs/swagger';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';

export class InmuebleDto {

  @ApiProperty()
  id?: number;

  @ApiProperty({ example: 'Calle #1 2-3' })
  direccion: string;

  @ApiProperty({ example: 100000, description: `Valor mensual del inmueble.` })
  valor: number;

  @ApiProperty({ required: false })
  fechaAsignacion?: Date;

  @ApiProperty({ required: false })
  fechaLimitePago?: Date;

  @ApiProperty({ required: false })
  fechaInicioPago?: Date;

  @ApiProperty()
  usuario?: UsuarioDto;

  @ApiProperty()
  usuarioId?: number;

}
