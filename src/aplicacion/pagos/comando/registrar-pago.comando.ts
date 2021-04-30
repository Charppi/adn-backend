import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VALOR_MINIMO_INMUEBLE } from 'src/dominio/inmueble/modelo/inmueble';

export class ComandoRegistrarPago {

    @IsNumber()
    @ApiProperty({ required: true, example: 1 })
    public idInmueble: number

    @IsNumber()
    @ApiProperty({ required: true, example: 1 })
    public idPagador: number

    @IsNumber()
    @ApiProperty({ required: true, example: VALOR_MINIMO_INMUEBLE })
    public valor: number;
}
