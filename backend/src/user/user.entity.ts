import {
    Entity,
    Property,
    Cascade,
    OneToOne,
    OneToMany,
    Collection,
  } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import {Reservation} from "../reservation/reservation.entity.js";

//import { Cliente } from '../cliente/cliente.entity.js';
  
  @Entity()
  export class User extends BaseEntity {
    //Datos del usuario
    @Property({ nullable: false })
    documentType!: string;

    @Property({ nullable: false, unique: true })
    documentID!: string;

    @Property({ nullable: false })
    userName!: string;

    @Property({ nullable: false })
    userSurname!: string;

    @Property({ type: 'date', nullable: false })
    birthDate!: Date;

    @Property({ nullable: false })
    address!: string;

    @Property({ nullable: false })
    phoneNumber!: string;

    @Property({ nullable: false })
    nationality!: string;

    //Datos de login / logout

    @Property({ nullable: false, unique: true })
    email!: string;
  
    @Property({ nullable: false })
    password!: string;

    @Property({ nullable: false })
    role!: string; //admin, employee, client


    @OneToMany(() => Reservation, (reservation) => reservation.user, {
      cascade: [Cascade.ALL],
    })
    reservations = new Collection<Reservation>(this);
  }
  