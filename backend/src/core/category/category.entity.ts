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
import { VehicleModel } from '../vehicle-model/vehicle-model.entity.js';

@Entity()
export class Category extends BaseEntity {
  @Property({ nullable: false, unique: true })
  categoryName!: string;

  @Property({ nullable: false })
  categoryDescription!: string;

  @Property({ nullable: false })
  pricePerDay!: number;

  @Property({ nullable: false })
  depositValue!: number;

  @OneToMany(() => VehicleModel, (vehicleModel) => vehicleModel.category)
  vehicleModels = new Collection<VehicleModel>(this);
}
