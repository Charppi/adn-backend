import { RepositorioPago } from 'src/dominio/pagos/puerto/repositorio/repositorio-pago';
import { RepositorioPagoMysql } from 'src/infraestructura/pagos/adaptador/repositorio/repositorio-pago-mysql';

export const repositorioPagoProvider = {
    provide: RepositorioPago,
    useClass: RepositorioPagoMysql,
};
