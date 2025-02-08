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
import { Location } from '../location/location.entity.js';
import { Color } from '../color/color.entity.js';
import { VehicleModel } from '../vehicle-model/vehicle-model.entity.js';
import { Reservation } from '../reservation/reservation.entity.js';

@Entity()
export class Vehicle extends BaseEntity {
  @Property({ nullable: false, unique: true })
  licensePlate!: string;

  @Property({ nullable: false })
  manufacturingYear!: number;

  @Property({ nullable: false })
  totalKms!: number;

  @ManyToOne(() => Location, { nullable: false })
  location!: Rel<Location>;

  @ManyToOne(() => Color, { nullable: false })
  color!: Rel<Color>;

  @ManyToOne(() => VehicleModel, { nullable: false })
  vehicleModel!: Rel<VehicleModel>;

  @OneToMany(() => Reservation, (reservation) => reservation.vehicle, {
    cascade: [Cascade.ALL],
  })
  reservations = new Collection<Reservation>(this);
}
