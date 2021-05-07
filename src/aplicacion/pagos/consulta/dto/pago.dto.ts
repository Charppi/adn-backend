import { ApiProperty } from '@nestjs/swagger';

export class PagoDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    valor: number;

    @ApiProperty()
    fechaPago: Date;

    @ApiProperty()
    desde: Date;

    @ApiProperty()
    hasta: Date;

    @ApiProperty()
    usuarioId: number;
}
