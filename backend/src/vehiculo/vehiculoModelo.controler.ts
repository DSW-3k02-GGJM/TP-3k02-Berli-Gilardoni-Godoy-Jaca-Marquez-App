import { Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { VehiculoModelo } from './vehiculoModelo.entity.js'
import { ObjectId } from '@mikro-orm/mongodb'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const vehiculoModelos = await em.find(VehiculoModelo, {})
    res.status(200).json({ message: 'Todos los modelos de vehiculos encontrados', data: vehiculoModelos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)
    const vehiculoModelo = await em.findOneOrFail(VehiculoModelo, { _id })
    res.status(200).json({ message: 'Se ha encontrado el modelo de vehiculo', data: vehiculoModelo })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const vehiculoModelo = em.create(VehiculoModelo, req.body)
    await em.flush()
    res.status(201).json({ message: 'Modelo de vehiculo creado', data: vehiculoModelo })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)
    const vehiculoModelo = em.getReference(VehiculoModelo, _id)
    em.assign(vehiculoModelo, req.body)
    await em.flush()
    res.status(200).json({ message: 'Modelo de vehiculo actualizado' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const _id = new ObjectId(req.params.id)
    const vehiculoModelo = em.getReference(VehiculoModelo, _id)
    await em.removeAndFlush(vehiculoModelo)
    res.status(200).send({ message: 'Modelo de vehiculo eliminado' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove }