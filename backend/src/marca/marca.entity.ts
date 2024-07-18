import { Cascade, Collection, DateTimeType, Entity, OneToMany, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { VehiculoModelo } from '../vehiculo/vehiculoModelo.entity.js'
//import crypto from 'node:crypto'

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

/*
export class Cliente{
    constructor(
        public tipoDoc: string,
        public nroDoc: string,
        public nombre: string,
        public apellido: string,
        public fechaNacimiento: string,
        public mail: string,
        public domicilio: string,
        public telefono: string,
        public nacionalidad: string,
        //public id = crypto.randomUUID()
        public _id ?: ObjectId
    ) {}
}
*/