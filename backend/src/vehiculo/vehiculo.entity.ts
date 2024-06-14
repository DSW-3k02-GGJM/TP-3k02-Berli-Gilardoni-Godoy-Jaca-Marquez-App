import { Entity, Property, ManyToMany, ManyToOne, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { VehiculoModelo } from "./vehiculoModelo.entity.js";
import { Cliente } from "../cliente/cliente.entity.js";

@Entity()
export class Vehiculo extends BaseEntity{
    @Property({nullable: false, unique:true})
    patente!: string

    @Property({nullable: false})
    añoFabricacion!: string

    @ManyToOne(() => VehiculoModelo, {nullable: false})
    vehiculoModelo!: Rel<VehiculoModelo>

    @ManyToMany(() => Cliente, (cliente) => cliente.vehiculos)
    clientes!: Cliente[]
}