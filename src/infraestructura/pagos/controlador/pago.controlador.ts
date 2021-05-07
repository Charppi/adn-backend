import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ComandoRegistrarPago } from 'src/aplicacion/pagos/comando/registrar-pago.comando';
import { ManejadorListarPagos } from 'src/aplicacion/pagos/consulta/listar-pagos.manejador';
import { PagoDto } from 'src/aplicacion/pagos/consulta/dto/pago.dto';
import { ManejadorRegistrarPago } from 'src/aplicacion/pagos/comando/registrar-pago.manejador';

@Controller('pagos')
export class PagoControlador {
    constructor(
        private readonly _manejadorRegistrarPago: ManejadorRegistrarPago,
        private readonly _manejadorListarPagos: ManejadorListarPagos,
    ) { }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async crear(@Body() comandoRegistrarPago: ComandoRegistrarPago) {
        return await this._manejadorRegistrarPago.ejecutar(comandoRegistrarPago);
    }

    @Get()
    async listar(): Promise<PagoDto[]> {
        return this._manejadorListarPagos.ejecutarListar();
    }

    @Get('/:id')
    @UsePipes(new ValidationPipe({ transform: true }))
    async obtenerPorId(@Param() { id }: { id: number }): Promise<PagoDto> {
        return this._manejadorListarPagos.ejecutarObtenerPorId(id);
    }
}
