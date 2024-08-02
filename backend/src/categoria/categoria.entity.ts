import {
  Entity,
  Property,
  OneToMany,
  Cascade,
  Collection,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Modelo } from '../modelo/modelo.entity.js';

@Entity()
export class Categoria extends BaseEntity {
  @Property({ nullable: false, unique: true })
  nombre!: string;

  @Property({ nullable: false })
  descripcion!: string;

  @Property({ type: 'float', nullable: false })
  precioPorDia!: number;

  @Property({ type: 'float', nullable: false })
  valorDeposito!: number;

  @OneToMany(() => Modelo, (modelo) => modelo.categoria, {
    cascade: [Cascade.ALL],
  })
  modelos = new Collection<Modelo>(this);
}
