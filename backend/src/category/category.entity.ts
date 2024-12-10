import {
  Entity,
  Property,
  OneToMany,
  Cascade,
  Collection,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { VehicleModel } from '../vehicleModel/vehicleModel.entity.js';

@Entity()
export class Category extends BaseEntity {
  @Property({ nullable: false, unique: true })
  categoryName!: string;

  @Property({ nullable: false })
  categoryDescription!: string;

  @Property({ type: 'float', nullable: false })
  pricePerDay!: number;

  @Property({ type: 'float', nullable: false })
  depositValue!: number;

  @OneToMany(() => VehicleModel, (vehicleModel) => vehicleModel.category, {
    cascade: [Cascade.ALL],
  })
  vehicleModels = new Collection<VehicleModel>(this);
}
