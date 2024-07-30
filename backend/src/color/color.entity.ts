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
export class Color extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.color, {
    cascade: [Cascade.ALL],
  })
  vehiculos = new Collection<Vehiculo>(this);
}
