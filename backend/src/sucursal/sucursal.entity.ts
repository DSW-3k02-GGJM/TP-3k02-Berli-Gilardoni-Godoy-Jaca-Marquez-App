import {
  Entity,
  Property,
  OneToMany,
  Cascade,
  Collection,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Vehiculo } from '../vehiculo/vehiculo.entity.js';

@Entity()
export class Sucursal extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  domicilio!: string;

  @Property({ nullable: false })
  telefono!: string;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.sucursal, {
    cascade: [Cascade.ALL],
  })
  vehiculos = new Collection<Vehiculo>(this);
}
