import {
  Entity,
  Property,
  Cascade,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { VehicleModel } from '../modelo/modelo.entity.js';

@Entity()
export class Brand extends BaseEntity {
  @Property({ nullable: false, unique: true })
  brandName!: string;

  @OneToMany(() => VehicleModel, (vehicleModel) => vehicleModel.brand, {
    cascade: [Cascade.ALL],
  })
  vehicleModels = new Collection<VehicleModel>(this);
}
