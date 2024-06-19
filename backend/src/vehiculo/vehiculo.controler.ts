import { Request, Response, NextFunction } from "express"
import { orm } from '../shared/db/orm.js'
import { Vehiculo } from './vehiculo.entity.js'

const em = orm.em

function sanitizedVehiculoInput(req: Request, res: Response, next:NextFunction){
    req.body.sanitizedInput = {
        patente: req.body.patente,
        añoFabricacion: req.body.añoFabricacion,
        vehiculoModelo: req.body.vehiculoModelo,
        clientes: req.body.clientes,
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
      const vehiculos = await em.find(Vehiculo, {}, { populate: ['vehiculoModelo', 'clientes'] })
      res.status(200).json({ message: 'Todos los vehiculos encontrados', data: vehiculos })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
    
  async function findOne(req: Request, res: Response) {
    try {
      const id = req.params.id
      const vehiculo = await em.findOneOrFail(Vehiculo,{ id },{ populate: ['vehiculoModelo', 'clientes'] }
      )
      res.status(200).json({ message: 'Vehiculo encontrado', data: vehiculo })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
    
async function add(req: Request, res: Response) {
  try {
    const vehiculo = em.create(Vehiculo, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Vehiculo creado', data: vehiculo })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
  
  async function update(req: Request, res: Response) {
    try {
      const id = req.params.id
      const vehiculoToUpdate = await em.findOneOrFail(Vehiculo, { id })
      em.assign(vehiculoToUpdate, req.body.sanitizedInput)
      await em.flush()
      res.status(200).json({ message: 'Vehiculo actualizado', data: vehiculoToUpdate })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  async function remove(req: Request, res: Response) {
    try {
      const id = req.params.id
      const vehiculo = em.getReference(Vehiculo, id)
      await em.removeAndFlush(vehiculo)
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }
  
  export { sanitizedVehiculoInput, findAll, findOne, add, update, remove }