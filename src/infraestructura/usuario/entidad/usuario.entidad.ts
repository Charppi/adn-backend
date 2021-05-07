import { InmuebleEntidad } from 'src/infraestructura/inmueble/entidad/inmueble.entidad';
import { PagoEntidad } from 'src/infraestructura/pagos/entidad/pago.entidad';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuario' })
export class UsuarioEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  cedula: number;

  @Column({ default: new Date() })
  fechaCreacion: Date;

  @OneToMany(() => InmuebleEntidad, inmueble => inmueble.usuario)
  inmuebles: InmuebleEntidad[];

  @OneToMany(() => PagoEntidad, pago => pago.usuario)
  pagos: PagoEntidad[];
}
