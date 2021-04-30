import { ApiProperty } from '@nestjs/swagger';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';

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
    usuario: UsuarioEntidad
}
