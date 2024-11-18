import { Router } from 'express';
import {findAll, findOne, add, update, remove, sanitizedVehicleModelInput, verifyVehicleModelNameExists} from './vehicleModel.controler.js';
import { AuthService } from '../shared/db/auth.service.js';

export const vehicleModelRouter = Router();

vehicleModelRouter.get('/', AuthService.isAuthenticated(["admin"]), findAll);
vehicleModelRouter.get('/:id', AuthService.isAuthenticated(["admin"]), findOne);
vehicleModelRouter.post('/', AuthService.isAuthenticated(["admin"]), sanitizedVehicleModelInput, add);
vehicleModelRouter.put('/:id', AuthService.isAuthenticated(["admin"]), sanitizedVehicleModelInput, update);
//vehicleModelRouter.patch('/:id', AuthService.isAuthenticated(["admin"]), sanitizedVehicleModelInput, update);
vehicleModelRouter.delete('/:id', AuthService.isAuthenticated(["admin"]), remove);

vehicleModelRouter.get('/entityName-exists/:vehicleModelName/:id', AuthService.isAuthenticated(["admin"]), verifyVehicleModelNameExists)
