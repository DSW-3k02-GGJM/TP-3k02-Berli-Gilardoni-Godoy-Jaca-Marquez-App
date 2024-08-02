import { Request, Response, NextFunction } from "express"
import { Alquiler } from "./alquiler.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

function sanitizedClienteInput(req: Request, res: Response, next:NextFunction){
    req.body.sanitizedInput = {
        kmRecorridos: req.body.kmRecorridos,
        fechaInicio: req.body.fechaInicio,
        fechaAlquiler: req.body.fechaAlquiler,
        fechaFin: req.body.fechaFin,
        fechaCancelacion: req.body.fechaCancelacion,
        tarifa: req.body.tarifa,
        cliente: req.body.cliente,
        vehiculo: req.body.vehiculo,
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
    const alquileres = await em.find(Alquiler, {} , { populate: ['vehiculo', 'cliente'] })
    res.status(200).json({ message: 'Todos los alquileres encontrados', data: alquileres })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id
    const alquiler = await em.findOneOrFail(Alquiler, { id } , { populate: ['vehiculo', 'cliente'] })
    res.status(200).json({ message: 'Alquiler encontrado', data: alquiler })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const alquiler = em.create(Alquiler, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Alquiler creado', data: alquiler })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const alquiler = em.getReference(Alquiler, id)
    em.assign(alquiler, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'Alquiler actualizado' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const alquiler = em.getReference(Alquiler, id)
    await em.removeAndFlush(alquiler)
    res.status(200).send({ message: 'Alquiler eliminado' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizedClienteInput, findAll, findOne, add, update, remove }