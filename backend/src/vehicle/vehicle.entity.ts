import {
  Entity,
  Property,
  ManyToOne,
  Rel,
  Cascade,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Location } from '../location/location.entity.js';
import { Color } from '../color/color.entity.js';
import { VehicleModel } from '../vehicleModel/vehicleModel.entity.js';
import { Reservation } from '../reservation/reservation.entity.js';

@Entity()
export class Vehicle extends BaseEntity {
  @Property({ nullable: false, unique: true })
  licensePlate!: string;

  @Property({ nullable: false })
  manufacturingYear!: string;

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

