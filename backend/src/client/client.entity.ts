import {
  Entity,
  Property,
  Cascade,
  Collection,
  OneToMany,
  OneToOne,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Reservation } from '../reservation/reservation.entity.js';
import { User } from '../user/user.entity';

@Entity()
export class Client extends BaseEntity {
  @Property({ nullable: false })
  documentType!: string;

  @Property({ nullable: false, unique: true })
  documentID!: string;

  @Property({ nullable: false })
  clientName!: string;

  @Property({ nullable: false })
  clientSurname!: string;

  @Property({ type: 'date', nullable: false })
  birthDate!: Date;

  @Property({ nullable: false })
  address!: string;

  @Property({ nullable: false })
  phoneNumber!: string;

  @Property({ nullable: false })
  nationality!: string;

  @OneToMany(() => Reservation, (reservation) => reservation.client, {
    cascade: [Cascade.ALL],
  })
  reservations = new Collection<Reservation>(this);

  /*
  @OneToOne(() => Usuario, (usuario) => usuario.cliente, {
    cascade: [Cascade.ALL],
  })
  usuario!: Usuario;
  */
}
