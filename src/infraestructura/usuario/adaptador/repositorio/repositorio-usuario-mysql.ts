import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { Usuario } from 'src/dominio/usuario/modelo/usuario';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntidad } from '../../entidad/usuario.entidad';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RepositorioUsuarioMysql implements RepositorioUsuario {
  constructor(
    @InjectRepository(UsuarioEntidad)
    private readonly repositorio: Repository<UsuarioEntidad>,
  ) { }
  async existeCedulaUsuario(cedula: number): Promise<boolean> {
    return (await this.repositorio.count({ cedula })) > 0;
  }

  async obtenerUsuarioId(id: number): Promise<UsuarioEntidad> {
    return await this.repositorio.findOne(id)
  }

  async guardar(usuario: Usuario) {
    const entidad = new UsuarioEntidad();
    entidad.cedula = usuario.cedula;
    entidad.nombre = usuario.nombre;
    entidad.apellido = usuario.apellido;
    entidad.fechaCreacion = new Date()
    await this.repositorio.save(entidad);
  }
}
