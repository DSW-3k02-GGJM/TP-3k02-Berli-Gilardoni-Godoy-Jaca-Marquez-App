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
import { Brand } from '../brand/brand.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';
import {Category} from "../category/category.entity.js";

@Entity()
export class VehicleModel extends BaseEntity {
  @Property({ nullable: false, unique: true })
  vehicleModelName!: string;

  @Property()
  transmissionType!: string;

  @Property()
  passengerCount!: number;

  @Property({ nullable: true }) // Nueva propiedad para la ruta de la imagen
  imagePath?: string;

  @ManyToOne(() => Category, { nullable: false })
  category!: Rel<Category>;

  @ManyToOne(() => Brand, { nullable: false })
  brand!: Rel<Brand>;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.vehicleModel, {
    cascade: [Cascade.ALL],
  })
  vehicles = new Collection<Vehicle>(this);
}
