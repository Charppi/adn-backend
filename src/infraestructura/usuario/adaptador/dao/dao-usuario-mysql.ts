import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { UsuarioDto } from 'src/aplicacion/usuario/consulta/dto/usuario.dto';
import { UsuarioEntidad } from '../../entidad/usuario.entidad';

@Injectable()
export class DaoUsuarioMysql implements DaoUsuario {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }
  listarTodos(): Promise<UsuarioDto[]> {
    return this.entityManager.query(
      `SELECT * FROM USUARIO;`,
    );
  }
  async existeCedulaUsuarioDiferente(cedula: number, id: number): Promise<UsuarioDto> {
    const [usuario] = await this.entityManager.query(`SELECT * FROM usuario WHERE cedula = ${cedula} AND  id != ${id}`);
    return usuario
  }
  totalUsuarios(): Promise<number> {
    return this.entityManager.count(UsuarioEntidad)
  }
  async existeCedulaUsuario(cedula: number): Promise<boolean> {
    return (await this.entityManager.count(UsuarioEntidad, { where: { cedula } })) > 0
  }
  async obtenerUsuarioId(id: number): Promise<UsuarioDto> {
    return await this.entityManager.findOne(UsuarioEntidad, { where: { id } })
  }

  async listar(limit: number = 0, offset: number = 0): Promise<UsuarioDto[]> {
    return this.entityManager.query(
      `SELECT * FROM USUARIO${(limit > 0 && offset > 0) ? ` LIMIT ${limit} OFFSET ${offset};` : `;`}`,
    );
  }
}
