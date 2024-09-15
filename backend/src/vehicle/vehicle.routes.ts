import { Router } from 'express'
import { sanitizedVehicleInput, findAll, findOne, add, update, remove, getAvailableVehicleModelsHandler } from './vehicle.controler.js'

export const vehicleRouter = Router()

vehicleRouter.get('/', findAll)
vehicleRouter.get('/:id', findOne)
vehicleRouter.post('/', sanitizedVehicleInput, add)
vehicleRouter.put('/:id', sanitizedVehicleInput, update)
vehicleRouter.patch('/:id', sanitizedVehicleInput, update)
vehicleRouter.delete('/:id', remove)
vehicleRouter.get('/available', getAvailableVehicleModelsHandler);

export default vehicleRouter;