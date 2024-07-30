import {
  Entity,
  Property,
  Cascade,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Modelo } from '../modelo/modelo.entity.js';

@Entity()
export class Marca extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombre!: string;

  @OneToMany(() => Modelo, (modelo) => modelo.marca, {
    cascade: [Cascade.ALL],
  })
  modelos = new Collection<Modelo>(this);
}
