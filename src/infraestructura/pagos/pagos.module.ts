import { Module } from '@nestjs/common';
import { PagoControlador } from './controlador/pago.controlador';
import { PagosProveedorModule } from './proveedor/pagos-proveedor.module';

@Module({
    imports: [PagosProveedorModule],
    controllers: [PagoControlador],
})
export class PagosModule { }
