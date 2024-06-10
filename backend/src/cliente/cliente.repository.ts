import { Repository } from "../shared/repository.js";
import { Cliente } from "./cliente.entity.js";
import { db } from "../shared/db/conn.js";
import { ObjectId } from "mongodb";

const clientes = db.collection<Cliente>('clientes')

export class ClienteRepository implements Repository<Cliente>{
    
    public async findAll(): Promise<Cliente[] | undefined> {
        return await clientes.find().toArray()
    }

    public async findOne(item: { id: string; }): Promise<Cliente | undefined> {
        const _id = new ObjectId(item.id)
        return (await clientes.findOne({_id})) || undefined
        //return await clientesArray.find((cliente) => cliente.nroDoc === item.id)
    }

    public async add(item: Cliente): Promise<Cliente | undefined> {
        item._id = (await clientes.insertOne(item)).insertedId
        return item
    }

    public async update(id:string,item: Cliente): Promise<Cliente | undefined> {
        const _id = new ObjectId(id)
        return (await clientes.findOneAndUpdate({_id}, { $set: item },{returnDocument:'after'})) || undefined
    }

    public async delete(item: { id: string; }): Promise<Cliente | undefined> {
        const _id = new ObjectId(item.id)
        return (await clientes.findOneAndDelete({_id})) || undefined
    }
}