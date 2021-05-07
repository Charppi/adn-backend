import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ComandoAsignarInmueble {

    @ApiProperty({ required: true, example: 1 })
    @IsNumber()
    public id: number;

    @IsNumber()
    @ApiProperty({ required: true })
    public idUsuarioAsignado: number;
}
