// MikroORM
import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';

// Entities
import { BaseEntity } from '../../shared/database/base.entity.js';
import { User } from '../user/user.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

@Entity()
export class Reservation extends BaseEntity {
  @Property({ nullable: false })
  reservationDate!: string;

  @Property({ nullable: false })
  startDate!: string;

  @Property({ nullable: false })
  plannedEndDate!: string;

  @Property({ nullable: true })
  realEndDate?: string;

  @Property({ nullable: true })
  cancellationDate?: string;

  @Property({ nullable: true })
  initialKms?: number;

  @Property({ nullable: true })
  finalKms?: number;

  @ManyToOne(() => User, { nullable: false })
  user!: Rel<User>;

  @ManyToOne(() => Vehicle, { nullable: false })
  vehicle!: Rel<Vehicle>;
}
