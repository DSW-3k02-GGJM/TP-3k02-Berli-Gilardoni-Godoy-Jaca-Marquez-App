import { Request, Response, NextFunction } from "express"
import { ClienteRepository } from "./cliente.repository.js"
import { Cliente } from "./cliente.entity.js"

const repository = new ClienteRepository()

function sanitizedClienteInput(req: Request, res: Response, next:NextFunction){
    req.body.sanitizedInput = {
        tipoDoc: req.body.tipoDoc,
        nroDoc: req.body.nroDoc,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        fechaNacimiento: req.body.fechaNacimiento,
        mail: req.body.mail,
        domicilio: req.body.domicilio,
        telefono: req.body.telefono,
        nacionalidad: req.body.nacionalidad
    }
    // Más validaciones
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function findAll(req: Request, res: Response) {
    res.json({data: await repository.findAll()})
}

async function findOne(req: Request, res: Response) {
    const cliente = await repository.findOne({id: req.params.id}) 
    if(!cliente){
        return res.status(404).send({message:'Cliente No Encontrado'})
    }
    res.json({data: cliente})
}

async function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput

    const clienteInput = new Cliente(input.tipoDoc,input.nroDoc,input.nombre,input.apellido,input.fechaNacimiento,input.mail,input.domicilio,input.telefono,input.nacionalidad)

    const cliente = await repository.add(clienteInput)
    return res.status(201).send({message: 'Cliente creado', data: cliente})
}

async function update(req: Request, res: Response) {
    const cliente = await repository.update(req.params.id,req.body.sanitizedInput)

    if(!cliente){
        return res.status(404).send({message:'Cliente No Encontrado'})
    }

    return res.status(200).send({message: 'Cliente modificado correctamente', data: cliente})
}

async function remove(req: Request, res: Response) {
    const cliente = await repository.delete({id: req.params.id})

    if(!cliente){
        res.status(404).send({message:'Cliente No Encontrado'})
    }
    else {
    res.status(200).send({message: 'Cliente borrado correctamente'})
    }
}
export {sanitizedClienteInput, findAll, findOne, add, update, remove}