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
import {attachEntityManager} from "../middleware/entityManager.middleware.js";

export const vehicleRouter = Router()

vehicleRouter.use(attachEntityManager); // Add this line to use the middleware

vehicleRouter.get('/', findAll);
vehicleRouter.get('/available', sanitizedFilterInput,findAvailable);
vehicleRouter.get('/:id', findOne);
vehicleRouter.post('/', sanitizedVehicleInput, add);
vehicleRouter.put('/:id', sanitizedVehicleInput, update);
vehicleRouter.patch('/:id', sanitizedVehicleInput, update);
vehicleRouter.delete('/:id', remove);
