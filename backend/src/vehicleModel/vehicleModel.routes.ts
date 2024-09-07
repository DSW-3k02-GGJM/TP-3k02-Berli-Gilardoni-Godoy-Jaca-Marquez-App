import { Router } from 'express';
import {findAll, findOne, add, update, remove, sanitizedVehicleModelInput} from './vehicleModel.controler.js';

export const vehicleModelRouter = Router();

vehicleModelRouter.get('/', findAll);
vehicleModelRouter.get('/:id', findOne);
vehicleModelRouter.post('/', sanitizedVehicleModelInput, add);
vehicleModelRouter.put('/:id', sanitizedVehicleModelInput, update);
vehicleModelRouter.patch('/:id', sanitizedVehicleModelInput, update);
vehicleModelRouter.delete('/:id', remove);