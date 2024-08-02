import {
  Entity,
  Property,
  Cascade,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Alquiler } from '../alquiler/alquiler.entity.js';

@Entity()
export class Cliente extends BaseEntity {
  @Property({ nullable: false })
  tipoDoc!: string;

  @Property({ nullable: false, unique: true })
  nroDoc!: string;

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  apellido!: string;

  @Property({ type: 'date', nullable: false })
  fechaNacimiento!: Date;

  @Property({ nullable: false })
  mail!: string;

  @Property({ nullable: false })
  domicilio!: string;

  @Property({ nullable: false })
  telefono!: string;

  @Property({ nullable: false })
  nacionalidad!: string;

  @OneToMany(() => Alquiler, (alquiler) => alquiler.cliente, {
    cascade: [Cascade.ALL],
  })
  alquileres = new Collection<Alquiler>(this);
}
