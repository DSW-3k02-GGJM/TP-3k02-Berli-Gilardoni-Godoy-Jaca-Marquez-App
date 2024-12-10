import {
  Entity,
  Property,
  OneToMany,
  Cascade,
  Collection,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

@Entity()
export class Color extends BaseEntity {
  @Property({ nullable: false, unique: true })
  colorName!: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.color, {
    cascade: [Cascade.ALL],
  })
  vehicles = new Collection<Vehicle>(this);
}
