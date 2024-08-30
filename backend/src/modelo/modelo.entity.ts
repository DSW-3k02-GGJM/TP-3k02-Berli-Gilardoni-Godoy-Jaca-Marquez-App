import {
  Cascade,
  Collection,
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Rel,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Brand } from '../marca/marca.entity.js';
import { Vehicle } from '../vehiculo/vehiculo.entity.js';
import { Category } from '../categoria/categoria.entity.js';

@Entity()
export class VehicleModel extends BaseEntity {
  @Property({ nullable: false })
  vehicleModelName!: string;

  @Property()
  transmissionType!: string;

  @Property()
  passengerCount!: number;

  @ManyToOne(() => Category, { nullable: false })
  category!: Rel<Category>;

  @ManyToOne(() => Brand, { nullable: false })
  brand!: Rel<Brand>;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.vehicleModel, {
    cascade: [Cascade.ALL],
  })
  vehicles = new Collection<Vehicle>(this);
}
