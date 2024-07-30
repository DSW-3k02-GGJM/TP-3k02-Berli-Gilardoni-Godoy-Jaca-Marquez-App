import {
  Cascade,
  Collection,
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Rel,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Marca } from '../marca/marca.entity.js';
import { Vehiculo } from '../vehiculo/vehiculo.entity.js';
import { Categoria } from '../categoria/categoria.entity.js';

@Entity()
export class Modelo extends BaseEntity {
  @Property({ nullable: false })
  nombre!: string;

  @Property()
  tipoTransmision!: string;

  @Property()
  cantPasajeros!: number;

  @ManyToOne(() => Categoria, { nullable: false })
  categoria!: Rel<Categoria>;

  @ManyToOne(() => Marca, { nullable: false })
  marca!: Rel<Marca>;

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.modelo, {
    cascade: [Cascade.ALL],
  })
  vehiculos = new Collection<Vehiculo>(this);
}
