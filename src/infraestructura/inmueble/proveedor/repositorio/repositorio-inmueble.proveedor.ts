import { RepositorioInmueble } from 'src/dominio/inmueble/puerto/repositorio/respositorio-inmueble';
import { RepositorioInmuebleMysql } from '../../adaptador/repositorio/repositorio-inmueble-mysql';

export const repositorioInmuebleProveedor = {
  provide: RepositorioInmueble,
  useClass: RepositorioInmuebleMysql,
};
