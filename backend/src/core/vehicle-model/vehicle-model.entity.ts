// MikroORM
import {
  Entity,
  Property,
  OneToMany,
  Cascade,
  Collection,
  ManyToOne,
  Rel,
} from '@mikro-orm/core';

// Entities
import { BaseEntity } from '../../shared/database/base.entity.js';
import { Category } from '../category/category.entity.js';
import { Brand } from '../brand/brand.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

@Entity()
export class VehicleModel extends BaseEntity {
  @Property({ nullable: false, unique: true })
  vehicleModelName!: string;

  @Property()
  transmissionType!: string;

  @Property()
  passengerCount!: number;

  @Property({ nullable: true })
  imagePath?: string;

  @ManyToOne(() => Category, { nullable: false })
  category!: Rel<Category>;

  @ManyToOne(() => Brand, { nullable: false })
  brand!: Rel<Brand>;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.vehicleModel)
  vehicles = new Collection<Vehicle>(this);
}
