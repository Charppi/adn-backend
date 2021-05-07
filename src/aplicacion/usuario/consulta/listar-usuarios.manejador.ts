import { Injectable } from '@nestjs/common';

import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';

@Injectable()
export class ManejadorListarUsuario {
  constructor(private _daoUsuario: DaoUsuario) { }

  async paginacion(limit: number, offset: number): Promise<{ usuarios: UsuarioDto[], total: number }> {
    const usuarios = await this._daoUsuario.listar(limit, offset);
    const total = await this._daoUsuario.totalUsuarios()
    return { usuarios, total }
  }

  async todos() {
    return await this._daoUsuario.listarTodos()
  }

}
