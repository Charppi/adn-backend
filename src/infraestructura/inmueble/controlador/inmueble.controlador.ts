import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ComandoRegistrarInmueble } from 'src/aplicacion/inmueble/comando/registrar-inmueble.comando';
import { ManejadorRegistrarInmueble } from 'src/aplicacion/inmueble/comando/registrar-inmueble.manejador';
import { ManejadorListarInmuebles } from 'src/aplicacion/inmueble/consulta/listar-inmuebles.manejador';
import { InmuebleDto } from 'src/aplicacion/inmueble/consulta/dto/inmueble.dto';
import { ManejadorEditarInmueble } from 'src/aplicacion/inmueble/comando/editar-inmueble.manejador';
import { ComandoEditarInmueble } from 'src/aplicacion/inmueble/comando/editar-inmueble.comando';

@Controller('inmuebles')
export class InmuebleControlador {
  constructor(
    private readonly _manejadorRegistrarInmueble: ManejadorRegistrarInmueble,
    private readonly _manejadorListarInmueble: ManejadorListarInmuebles,
    private readonly _manejadorEditarInmueble: ManejadorEditarInmueble
  ) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Body() comandoRegistrarInmueble: ComandoRegistrarInmueble) {
    await this._manejadorRegistrarInmueble.ejecutar(comandoRegistrarInmueble);
  }

  @Put()
  @UsePipes(new ValidationPipe({ transform: true }))
  async editar(@Body() comandoEditarInmueble: ComandoEditarInmueble) {
    await this._manejadorEditarInmueble.ejecutar(comandoEditarInmueble)
  }

  @Get()
  async listar(): Promise<InmuebleDto[]> {
    return this._manejadorListarInmueble.ejecutarListar();
  }

  @Get('/:id')
  async obtenerPorId(@Param() id: number): Promise<InmuebleDto> {
    return this._manejadorListarInmueble.ejecutarObtenerPorId(id);
  }
}
