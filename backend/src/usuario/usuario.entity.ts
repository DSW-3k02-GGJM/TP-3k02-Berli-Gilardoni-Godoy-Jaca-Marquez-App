import {
    Entity,
    Property,
    Cascade,
    OneToOne,
  } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Cliente } from '../cliente/cliente.entity.js';
  
  @Entity()
  export class Usuario extends BaseEntity {
    @Property({ nullable: false, unique: true })
    email!: string;
  
    @Property({ nullable: false })
    password!: string;
  
    /*@OneToOne(() => Cliente, (cliente) => cliente.usuario, {
      cascade: [Cascade.ALL],
    })
    cliente!: Cliente
    */
  }
  