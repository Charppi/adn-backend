import { DaoPago } from 'src/dominio/pagos/puerto/dao/dao-pago';
import { DaoPagoMysql } from 'src/infraestructura/pagos/adaptador/dao/dao-pago-mysql';

export const daoPagoProvider = {
    provide: DaoPago,
    useClass: DaoPagoMysql,
};
