import {ObjectId} from "@mikro-orm/mongodb";
import crypto from 'node:crypto'

export class Categoria {
    constructor(
       public nombreCategoria: string,
       public descripcion: string,
       public precioPorDia: number,
       public valorDeposito: number,
       public idCategoria?: number
    ) {}
}