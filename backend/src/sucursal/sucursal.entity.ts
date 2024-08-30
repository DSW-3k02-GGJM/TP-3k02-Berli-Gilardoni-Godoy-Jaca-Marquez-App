import {
  Entity,
  Property,
  OneToMany,
  Cascade,
  Collection,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Vehicle } from '../vehiculo/vehiculo.entity.js';

@Entity()
export class Location extends BaseEntity {
  @Property({ nullable: false })
  locationName!: string;

  @Property({ nullable: false })
  address!: string;

  @Property({ nullable: false })
  phoneNumber!: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.location, {
    cascade: [Cascade.ALL],
  })
  vehicles = new Collection<Vehicle>(this);
}
