import { ApiProperty } from '@nestjs/swagger';

export class UsuarioDto {

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'William' })
  nombre: string;

  @ApiProperty({ example: "Mendez" })
  apellido: string;

  @ApiProperty({ example: 123456789 })
  cedula: number
  
}
