import { Cascade, Collection, DateTimeType, Entity, OneToMany, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { VehiculoModelo } from '../vehiculo/vehiculoModelo.entity.js'

@Entity()
export class Marca extends BaseEntity {

    @Property({nullable: false, unique:true})
    nombre!: string

    /*
    @OneToMany(() => VehiculoModelo, vehiculoModelo => vehiculoModelo.marca, { cascade: true })
    modelos: VehiculoModelo[];*/
    @OneToMany(() => VehiculoModelo, vehiculoModelo => vehiculoModelo.marca, { cascade: [Cascade.ALL] })
    modelos = new Collection<VehiculoModelo>(this);
}