import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoEntidad } from '../entidad/pago.entidad';
import { ServicioRegistrarPago } from 'src/dominio/pagos/servicio/servicio-registrar-pago';
import { RepositorioPago } from 'src/dominio/pagos/puerto/repositorio/repositorio-pago';
import { servicioRegistrarPagoProveedor } from './servicio/servicio-registrar-pago-proveedor';
import { repositorioPagoProvider } from './repositorio/repositorio-pago-proveedor';
import { daoPagoProvider } from './dao/dao-pago-proveedor';
import { ManejadorRegistrarPago } from 'src/aplicacion/pagos/comando/registrar-pago.manejador';
import { ManejadorListarPagos } from 'src/aplicacion/pagos/consulta/listar-pagos.manejador';
import { DaoPago } from 'src/dominio/pagos/puerto/dao/dao-pago';
import { InmuebleProveedorModule } from 'src/infraestructura/inmueble/proveedor/inmueble-proveedor.module';
import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';

@Module({
    imports: [TypeOrmModule.forFeature([PagoEntidad]), InmuebleProveedorModule],
    providers: [
        {
            provide: ServicioRegistrarPago,
            inject: [RepositorioPago, RepositorioInmueble],
            useFactory: servicioRegistrarPagoProveedor,
        },
        repositorioPagoProvider,
        daoPagoProvider,
        ManejadorRegistrarPago,
        ManejadorListarPagos,
    ],
    exports: [
        ServicioRegistrarPago,
        ManejadorRegistrarPago,
        ManejadorListarPagos,
        RepositorioPago,
        DaoPago
    ],
})
export class PagosProveedorModule { }
