import { Module } from '@nestjs/common';
import { UsuarioProveedorModule } from '../usuario/proveedor/usuario-proveedor.module';
import { InmuebleControlador } from './controlador/inmueble.controlador';
import { InmuebleProveedorModule } from './proveedor/inmueble-proveedor.module';

@Module({
  imports: [InmuebleProveedorModule],
  controllers: [InmuebleControlador],
})
export class InmuebleModule { }
