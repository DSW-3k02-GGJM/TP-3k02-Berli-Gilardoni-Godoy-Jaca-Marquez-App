import { Entity, Property, OneToMany, ManyToOne, Rel, Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { VehiculoModelo } from "./vehiculoModelo.entity.js";
import { Alquiler } from "../cliente/alquiler.entity.js";

@Entity()
export class Vehiculo extends BaseEntity{
    @Property({nullable: false, unique:true})
    patente!: string

    @Property({nullable: false})
    añoFabricacion!: string

    @ManyToOne(() => VehiculoModelo, {nullable: false})
    vehiculoModelo!: Rel<VehiculoModelo>

    @OneToMany(() => Alquiler, alquiler => alquiler.vehiculo, {cascade: [Cascade.ALL]})
    alquileres = new Collection<Alquiler>(this)
}