import { PagoEntidad } from 'src/infraestructura/pagos/entidad/pago.entidad';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'inmueble' })
export class InmuebleEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  direccion: string;

  @Column()
  valor: number;

  @Column()
  fechaAsignacion: Date;

  @Column({ nullable: true })
  fechaInicioPago: Date;

  @Column({ nullable: true })
  fechaLimitePago: Date;

  @Column({ nullable: true })
  usuarioId: number;

  @ManyToOne(() => UsuarioEntidad, usuario => usuario.inmuebles, { nullable: true })
  usuario: UsuarioEntidad;

  @OneToMany(() => PagoEntidad, pago => pago.inmueble)
  pagos: PagoEntidad[];

}
