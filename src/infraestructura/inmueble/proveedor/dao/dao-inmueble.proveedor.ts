import { DaoInmueble } from 'src/dominio/inmueble/puerto/dao/dao-inmueble';
import { DaoInmobiliariaMysql } from 'src/infraestructura/inmueble/adaptador/dao/dao-inmobiliaria-mysql';

export const daoInmuebleProveedor = {
  provide: DaoInmueble,
  useClass: DaoInmobiliariaMysql,
};
