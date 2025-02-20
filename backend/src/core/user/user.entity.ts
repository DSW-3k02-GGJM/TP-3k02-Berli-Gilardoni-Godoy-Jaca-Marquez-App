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
import { Reservation } from '../reservation/reservation.entity.js';

@Entity()
export class User extends BaseEntity {
  // Datos del usuario
  @Property({ nullable: false })
  documentType!: string;

  @Property({ nullable: false, unique: true })
  documentID!: string;

  @Property({ nullable: false })
  userName!: string;

  @Property({ nullable: false })
  userSurname!: string;

  @Property({ nullable: false })
  birthDate!: string;

  @Property({ nullable: false })
  address!: string;

  @Property({ nullable: false })
  phoneNumber!: string;

  @Property({ nullable: false })
  nationality!: string;

  // Datos de login / logout
  @Property({ nullable: false, unique: true })
  email!: string;

  @Property({ nullable: false })
  password!: string;

  // admin, employee, client
  @Property({ nullable: false })
  role!: string;

  @Property({ nullable: false })
  verified!: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations = new Collection<Reservation>(this);
}
