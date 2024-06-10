import { ObjectId } from 'mongodb';
import crypto from 'node:crypto'

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
