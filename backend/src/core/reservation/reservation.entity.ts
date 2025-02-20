// MikroORM
import {
  Entity,
  Property,
  ManyToOne,
  Rel,
  OneToOne,
  OneToMany,
  Cascade,
  Collection,
} from '@mikro-orm/core';

// Entities
import { BaseEntity } from '../../shared/database/base.entity.js';
import { User } from '../user/user.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';
import { Reminder } from '../reminder/reminder.entity.js';

@Entity()
export class Reservation extends BaseEntity {
  @Property({ columnType: 'DATE', nullable: false })
  reservationDate!: string;

  @Property({ columnType: 'DATE', nullable: false })
  startDate!: string;

  @Property({ columnType: 'DATE', nullable: false })
  plannedEndDate!: string;

  @Property({ columnType: 'DATE', nullable: true })
  realEndDate?: string;

  @Property({ columnType: 'DATE', nullable: true })
  cancellationDate?: string;

  @Property({ nullable: true })
  initialKms?: number;

  @Property({ nullable: true })
  finalKms?: number;

  @Property({ nullable: true })
  finalPrice?: number;

  @ManyToOne(() => User, { nullable: false })
  user!: Rel<User>;

  @ManyToOne(() => Vehicle, { nullable: false })
  vehicle!: Rel<Vehicle>;

  @OneToMany(() => Reminder, (reminder) => reminder.reservation)
  reminders = new Collection<Reminder>(this);
}
