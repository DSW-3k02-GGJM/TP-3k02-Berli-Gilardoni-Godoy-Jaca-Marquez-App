// MikroORM
import {
  Entity,
  Property,
  OneToMany,
  Cascade,
  Collection,
} from '@mikro-orm/core';

// Entities
import { BaseEntity } from '../../shared/database/base.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

@Entity()
export class Location extends BaseEntity {
  @Property({ nullable: false, unique: true })
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
