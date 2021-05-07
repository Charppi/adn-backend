import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VALOR_MINIMO_INMUEBLE } from 'src/dominio/inmueble/modelo/inmueble';

export class ComandoEditarInmueble {

    @ApiProperty({ required: true, example: 1 })
    @IsNumber()
    public id: number;

    @ApiProperty({ required: true, example: 'Calle 123' })
    @IsString()
    public direccion: string;

    @ApiProperty({ required: true, minimum: VALOR_MINIMO_INMUEBLE })
    @IsNumber()
    public valor: number;

    @IsOptional()
    @ApiProperty({ type: Date, required: false })
    @IsDateString()
    public fechaAsignacion?: Date;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false, nullable: true })
    public idUsuarioAsignado?: number;
}
