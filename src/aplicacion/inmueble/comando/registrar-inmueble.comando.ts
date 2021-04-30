import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VALOR_MINIMO_INMUEBLE } from 'src/dominio/inmueble/modelo/inmueble';

export class ComandoRegistrarInmueble {
  @IsString()
  @ApiProperty({ required: true, example: 'Calle 123' })
  public direccion: string;

  @IsNumber()
  @ApiProperty({ required: true, minimum: VALOR_MINIMO_INMUEBLE })
  public valor: number;
}
