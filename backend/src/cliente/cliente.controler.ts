import { Request, Response, NextFunction } from "express"
import { Cliente } from "./cliente.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

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
  try {
    const clientes = await em.find(Cliente, {} , { populate: ['vehiculos'] })
    res.status(200).json({ message: 'Todos los clientes encontrados', data: clientes })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const cliente = await em.findOneOrFail(Cliente, { id } , { populate: ['vehiculos'] })
    res.status(200).json({ message: 'Cliente encontrado', data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const cliente = em.create(Cliente, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Cliente creado', data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const cliente = em.getReference(Cliente, id)
    em.assign(cliente, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'Cliente actualizado' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const cliente = em.getReference(Cliente, id)
    await em.removeAndFlush(cliente)
    res.status(200).send({ message: 'Cliente eliminado' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizedClienteInput, findAll, findOne, add, update, remove }