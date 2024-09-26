import { Router } from 'express'
import {
    sanitizedVehicleInput,
    sanitizedFilterInput,
    findAll,
    findOne,
    add,
    update,
    remove,
    findAvailable,
} from './vehicle.controler.js'

export const vehicleRouter = Router()

vehicleRouter.get('/', findAll);
vehicleRouter.get('/available', sanitizedFilterInput,findAvailable);
vehicleRouter.get('/:id', findOne);
vehicleRouter.post('/', sanitizedVehicleInput, add);
vehicleRouter.put('/:id', sanitizedVehicleInput, update);
vehicleRouter.patch('/:id', sanitizedVehicleInput, update);
vehicleRouter.delete('/:id', remove);
