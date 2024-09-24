import { Router } from 'express'
import {
    sanitizedVehicleInput,
    findAll,
    findOne,
    add,
    update,
    remove,
    getAvailableVehicleModelsHandler,
} from './vehicle.controler.js'
import {attachEntityManager} from "../middleware/entityManager.middleware.js";

export const vehicleRouter = Router()

vehicleRouter.use(attachEntityManager); // Add this line to use the middleware

vehicleRouter.get('/', findAll);
vehicleRouter.get('/available', getAvailableVehicleModelsHandler);
vehicleRouter.get('/:id', findOne);
vehicleRouter.post('/', sanitizedVehicleInput, add);
vehicleRouter.put('/:id', sanitizedVehicleInput, update);
vehicleRouter.patch('/:id', sanitizedVehicleInput, update);
vehicleRouter.delete('/:id', remove);

export default vehicleRouter;