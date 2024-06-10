import { Repository } from "../shared/repository.js";
import { Cliente } from "./cliente.entity.js";

const clientes = [
    new Cliente(
        'DNI',
        '44213356',
        'Matias',
        'Marquez',
        '26/02/2024',
        'matiasddae@gmail.com',
        'Colombres 2145',
        '2453243',
        'Argentino'
    )
]

export class ClienteRepository implements Repository<Cliente>{
    
    public findAll(): Cliente[] | undefined {
        return clientes
    }

    public findOne(item: { id: string; }): Cliente | undefined {
        return clientes.find((cliente) => cliente.nroDoc === item.id)
    }

    public add(item: Cliente): Cliente | undefined {
        clientes.push(item)
        return item
    }

    public update(item: Cliente): Cliente | undefined {
        const clienteIdx = clientes.findIndex((cliente) => cliente.nroDoc === item.nroDoc)

    if(clienteIdx!==-1){
        Object.assign(clientes[clienteIdx], item)
    }
        return clientes[clienteIdx]
    }

    public delete(item: { id: string; }): Cliente | undefined {
        const clienteIdx = clientes.findIndex((cliente) => cliente.nroDoc === item.id)

        if(clienteIdx!==-1){
            const deletedCliente = clientes[clienteIdx]
            clientes.splice(clienteIdx,1)
            return deletedCliente
        }
    }
}