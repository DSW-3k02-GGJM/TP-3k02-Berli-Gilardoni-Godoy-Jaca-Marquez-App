// MikroORM
import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';

// Entities
import { Reservation } from '../reservation/reservation.entity.js';
import { BaseEntity } from '../../shared/database/base.entity.js';

@Entity()
export class Reminder extends BaseEntity {
  @Property({ columnType: 'DATE', nullable: false })
  reminderDate!: string;

  @Property({ nullable: false })
  sent!: boolean;

  @ManyToOne(() => Reservation, { nullable: false })
  reservation!: Rel<Reservation>;
}
