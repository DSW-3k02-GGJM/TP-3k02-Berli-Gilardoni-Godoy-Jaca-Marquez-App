import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Cliente } from '../cliente/cliente.entity.js';
import { Vehiculo } from '../vehiculo/vehiculo.entity.js';

@Entity()
export class Alquiler extends BaseEntity {
  @Property({ type: 'date' })
  fechaAlquiler = new Date();

  @Property({ type: 'date', nullable: false })
  fechaInicio!: Date;

  @Property({ type: 'date', nullable: false })
  fechaFinPactada!: Date;

  @Property({ type: 'date', nullable: true })
  fechaFinReal?: Date;

  @Property({ type: 'date', nullable: true })
  fechaCancelacion?: Date;

  @Property({ nullable: false })
  kmIniciales!: number;

  @Property({ nullable: true })
  kmFinales?: number;

  @ManyToOne(() => Cliente, { nullable: false })
  cliente!: Rel<Cliente>;

  @ManyToOne(() => Vehiculo, { nullable: false })
  vehiculo!: Rel<Vehiculo>;
}
