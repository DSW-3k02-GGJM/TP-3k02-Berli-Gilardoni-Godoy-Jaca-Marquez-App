import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';
import { User } from '../user/user.entity.js';

@Entity()
export class Reservation extends BaseEntity {
  @Property({ type: 'date' })
  reservationDate = new Date();

  @Property({ type: 'date', nullable: false })
  startDate!: Date;

  @Property({ type: 'date', nullable: false })
  plannedEndDate!: Date;

  @Property({ type: 'date', nullable: true })
  realEndDate?: Date;

  @Property({ type: 'date', nullable: true })
  cancellationDate?: Date;

  @Property({ nullable: true })
  initialKms?: number;

  @Property({ nullable: true })
  finalKm?: number;

  @ManyToOne(() => User, { nullable: false })
  user!: Rel<User>;

  @ManyToOne(() => Vehicle, { nullable: false })
  vehicle!: Rel<Vehicle>;
}
