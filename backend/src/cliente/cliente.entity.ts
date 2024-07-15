import { Cascade, Collection, DateTimeType, Entity, OneToMany, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Alquiler } from './alquiler.entity.js'
//import crypto from 'node:crypto'

@Entity()
export class Cliente extends BaseEntity {
    @Property({nullable: false})
    tipoDoc!: string

    @Property({nullable: false, unique:true})
    nroDoc!: string

    @Property({nullable: false})
    nombre!: string

    @Property({nullable: false})
    apellido!: string

    @Property({nullable: false})
    fechaNacimiento!: DateTimeType

    @Property({nullable: false})
    mail!: string

    @Property({nullable: false})
    domicilio!: string

    @Property({nullable: false})
    telefono!: string

    @Property({nullable: false})
    nacionalidad!: string

    @OneToMany(() => Alquiler, alquiler => alquiler.cliente, {cascade: [Cascade.ALL]})
    alquileres = new Collection<Alquiler>(this)
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