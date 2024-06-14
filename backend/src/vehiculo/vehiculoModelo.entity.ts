import { Cascade, Collection, Entity, OneToMany, Property, /*Cascade*/ } from "@mikro-orm/core"
import { Vehiculo } from "./vehiculo.entity.js"
import { BaseEntity } from "../shared/db/baseEntity.entity.js"

@Entity()
export class VehiculoModelo extends BaseEntity { 
    @Property({nullable: false, /*unique: true}*/})
    nombre!: string

    @Property()
    tipoTransmision!: string

    @Property()
    cantPasajeros!: number

    @OneToMany(() => Vehiculo, vehiculo => vehiculo.vehiculoModelo, {cascade: [Cascade.ALL]})
    vehiculos = new Collection<Vehiculo>(this)
}