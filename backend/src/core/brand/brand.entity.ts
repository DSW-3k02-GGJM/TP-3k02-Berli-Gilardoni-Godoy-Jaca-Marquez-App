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
export class Brand extends BaseEntity {
  @Property({ nullable: false, unique: true })
  brandName!: string;

  @OneToMany(() => VehicleModel, (vehicleModel) => vehicleModel.brand, {
    cascade: [Cascade.ALL],
  })
  vehicleModels = new Collection<VehicleModel>(this);
}
