import {
  Entity,
  Property,
  ManyToOne,
  Rel,
  Cascade,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Sucursal } from '../sucursal/sucursal.entity.js';
import { Color } from '../color/color.entity.js';
import { Modelo } from '../modelo/modelo.entity.js';
import { Alquiler } from '../alquiler/alquiler.entity.js';

@Entity()
export class Vehiculo extends BaseEntity {
  @Property({ nullable: false, unique: true })
  patente!: string;

  @Property({ nullable: false })
  anioFabricacion!: string;

  @Property({ nullable: false })
  kmRecorridos!: number;

  @ManyToOne(() => Sucursal, { nullable: false })
  sucursal!: Rel<Sucursal>;

  @ManyToOne(() => Color, { nullable: false })
  color!: Rel<Color>;

  @ManyToOne(() => Modelo, { nullable: false })
  modelo!: Rel<Modelo>;

  @OneToMany(() => Alquiler, (alquiler) => alquiler.vehiculo, {
    cascade: [Cascade.ALL],
  })
  alquileres = new Collection<Alquiler>(this);
}
