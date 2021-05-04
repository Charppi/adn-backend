import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManejadorAsignarInmueble } from 'src/aplicacion/inmueble/comando/asignar-inmueble.manejador';
import { ManejadorEditarInmueble } from 'src/aplicacion/inmueble/comando/editar-inmueble.manejador';
import { ManejadorRegistrarInmueble } from 'src/aplicacion/inmueble/comando/registrar-inmueble.manejador';
import { ManejadorListarInmuebles } from 'src/aplicacion/inmueble/consulta/listar-inmuebles.manejador';
import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { ServicioAsignarInmueble } from 'src/dominio/inmueble/servicio/servicio-asignar-inmueble';
import { ServicioEditarInmueble } from 'src/dominio/inmueble/servicio/servicio-editar-inmueble';
import { ServicioRegistrarInmueble } from 'src/dominio/inmueble/servicio/servicio-registrar-inmueble';
import { DaoUsuario } from 'src/dominio/usuario/puerto/dao/dao-usuario';
import { RepositorioUsuario } from 'src/dominio/usuario/puerto/repositorio/repositorio-usuario';
import { UsuarioProveedorModule } from 'src/infraestructura/usuario/proveedor/usuario-proveedor.module';
import { InmuebleEntidad } from '../entidad/inmueble.entidad';
import { daoInmuebleProveedor } from './dao/dao-inmueble.proveedor';
import { repositorioInmuebleProveedor } from './repositorio/repositorio-inmueble.proveedor';
import { servicioAsignarInmuebleProveedor } from './servicio/servicio-asignar-inmueble.provider';
import { servicioEditarInmuebleProveedor } from './servicio/servicio-editar-inmueble.provider';
import { servicioRegistrarInmuebleProveedor } from './servicio/servicio-registrar-inmueble.provider';

@Module({
  imports: [TypeOrmModule.forFeature([InmuebleEntidad]), UsuarioProveedorModule],
  providers: [
    {
      provide: ServicioRegistrarInmueble,
      inject: [RepositorioInmueble, DaoInmueble],
      useFactory: servicioRegistrarInmuebleProveedor,
    },
    {
      provide: ServicioEditarInmueble,
      inject: [RepositorioInmueble, DaoInmueble],
      useFactory: servicioEditarInmuebleProveedor,
    },
    {
      provide: ServicioAsignarInmueble,
      inject: [RepositorioInmueble, DaoInmueble, DaoUsuario],
      useFactory: servicioAsignarInmuebleProveedor,
    },
    repositorioInmuebleProveedor,
    daoInmuebleProveedor,
    ManejadorRegistrarInmueble,
    ManejadorListarInmuebles,
    ManejadorEditarInmueble,
    ManejadorAsignarInmueble
  ],
  exports: [
    ServicioRegistrarInmueble,
    ServicioEditarInmueble,
    ManejadorRegistrarInmueble,
    ManejadorListarInmuebles,
    ManejadorEditarInmueble,
    ManejadorAsignarInmueble,
    RepositorioInmueble,
    DaoInmueble,
  ],
})
export class InmuebleProveedorModule { }
