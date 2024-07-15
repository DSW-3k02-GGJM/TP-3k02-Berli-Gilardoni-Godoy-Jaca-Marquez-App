import { Cascade, Collection, DateTimeType, Entity, ManyToOne, Property, Rel } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Cliente } from './cliente.entity.js'
import { Vehiculo } from '../vehiculo/vehiculo.entity.js'

@Entity()
export class Alquiler extends BaseEntity {
    @Property()
    kmRecorridos!: number

    @Property({ type: DateTimeType })
    fechaInicio? = new Date()

    @Property({ type: DateTimeType })
    fechaAlquiler?: Date

    @Property({ type: DateTimeType })
    fechaFin?: Date

    @Property({ type: DateTimeType, nullable: true })
    fechaCancelacion?: Date

    @Property()
    tarifa!: number

    @ManyToOne(() => Vehiculo, {nullable: false, cascade: [Cascade.ALL]})
    vehiculo!: Rel<Vehiculo>

    @ManyToOne(() => Cliente, {nullable: false, cascade: [Cascade.ALL]})
    cliente!: Rel<Cliente>

}