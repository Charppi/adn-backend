import { InmuebleEntidad } from 'src/infraestructura/inmueble/entidad/inmueble.entidad';
import { UsuarioEntidad } from 'src/infraestructura/usuario/entidad/usuario.entidad';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pago' })
export class PagoEntidad {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    valor: number;

    @Column()
    cargo: number;

    @Column()
    total: number;

    @Column()
    fechaPago: Date;

    @Column({ nullable: true })
    desde: Date;

    @Column({ nullable: true })
    hasta: Date;

    @ManyToOne(() => UsuarioEntidad, usuario => usuario.inmuebles, { nullable: true })
    usuario: UsuarioEntidad;

    @ManyToOne(() => InmuebleEntidad, inmueble => inmueble.pagos, { nullable: true })
    inmueble: InmuebleEntidad;

}
