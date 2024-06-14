import { Router } from 'express'
import { sanitizedVehiculoInput, findAll, findOne, add, update, remove } from './vehiculo.controler.js'

export const vehiculoRouter = Router()

vehiculoRouter.get('/', findAll)
vehiculoRouter.get('/:id', findOne)
vehiculoRouter.post('/', sanitizedVehiculoInput, add)
vehiculoRouter.put('/:id', sanitizedVehiculoInput, update)
vehiculoRouter.patch('/:id', sanitizedVehiculoInput, update)
vehiculoRouter.delete('/:id', remove)