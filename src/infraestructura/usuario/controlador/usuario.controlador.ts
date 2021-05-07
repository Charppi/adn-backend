import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ComandoRegistrarUsuario } from 'src/aplicacion/usuario/comando/registrar-usuario.comando';
import { ManejadorRegistrarUsuario } from 'src/aplicacion/usuario/comando/registar-usuario.manejador';
import { ManejadorListarUsuario } from 'src/aplicacion/usuario/consulta/listar-usuarios.manejador';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { ComandoEditarUsuario } from 'src/aplicacion/usuario/comando/editar-usuario.comando';
import { ManejadorEditarUsuario } from 'src/aplicacion/usuario/comando/editar-usuario.manejador';

@Controller('usuarios')
export class UsuarioControlador {
  constructor(
    private readonly _manejadorRegistrarUsuario: ManejadorRegistrarUsuario,
    private readonly _manejadorListarUsuario: ManejadorListarUsuario,
    private readonly _manejadorEditarUsuario: ManejadorEditarUsuario,
  ) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Body() comandoRegistrarUsuario: ComandoRegistrarUsuario) {
    await this._manejadorRegistrarUsuario.ejecutar(comandoRegistrarUsuario);
  }

  @Put()
  @UsePipes(new ValidationPipe({ transform: true }))
  async editar(@Body() comandoEditarusuario: ComandoEditarUsuario) {
    await this._manejadorEditarUsuario.ejecutar(comandoEditarusuario);
  }

  @Get()
  async listar(@Query() query: { limit: number, offset: number }): Promise<{ usuarios: UsuarioDto[], total: number }> {
    return this._manejadorListarUsuario.paginacion(query.limit, query.offset);
  }

  @Get("/todos")
  async listarTodos() {
    return this._manejadorListarUsuario.todos();
  }
}
