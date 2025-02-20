// MikroORM
import {
  Entity,
  Property,
  OneToMany,
  Cascade,
  Collection,
} from '@mikro-orm/core';

//Entities
import { BaseEntity } from '../../shared/database/base.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

@Entity()
export class Color extends BaseEntity {
  @Property({ nullable: false, unique: true })
  colorName!: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.color)
  vehicles = new Collection<Vehicle>(this);
}
