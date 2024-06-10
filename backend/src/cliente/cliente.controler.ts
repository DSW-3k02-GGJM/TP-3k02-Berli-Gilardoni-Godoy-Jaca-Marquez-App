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

function findAll(req: Request, res: Response) {
    res.json({data: repository.findAll()})
}

function findOne(req: Request, res: Response) {
    const cliente = repository.findOne({id: req.params.id}) 
    if(!cliente){
        return res.status(404).send({message:'Cliente No Encontrado'})
    }
    res.json({data: cliente})
}

function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput

    const clienteInput = new Cliente(input.tipoDoc,input.nroDoc,input.nombre,input.apellido,input.fechaNacimiento,input.mail,input.domicilio,input.telefono,input.nacionalidad)

    const cliente = repository.add(clienteInput)
    return res.status(201).send({message: 'Cliente creado', data: cliente})
}

function update(req: Request, res: Response) {
    req.body.sanitizedInput.id = req.params.id
    const cliente = repository.update(req.body.sanitizedInput)

    if(!cliente){
        return res.status(404).send({message:'Cliente No Encontrado'})
    }

    return res.status(200).send({message: 'Cliente modificado correctamente', data: cliente})
}

function remove(req: Request, res: Response) {
    const cliente = repository.delete({id: req.params.id})

    if(!cliente){
        res.status(404).send({message:'Cliente No Encontrado'})
    }
    else {
    res.status(200).send({message: 'Cliente borrado correctamente'})
    }
}
export {sanitizedClienteInput, findAll, findOne, add, update, remove}