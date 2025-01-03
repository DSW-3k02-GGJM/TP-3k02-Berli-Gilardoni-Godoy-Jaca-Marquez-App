// Express
import { Router } from 'express';

// Controllers
import {
  sanitizedFilterInput,
  findAvailable,
  findAll,
  verifyLicensePlateExists,
  findOne,
  sanitizedVehicleInput,
  add,
  update,
  remove,
} from './vehicle.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

export const vehicleRouter = Router();

vehicleRouter.get('/available', sanitizedFilterInput, findAvailable);

vehicleRouter.get('/', AuthService.isAuthenticated(['admin']), findAll);

vehicleRouter.get(
  '/entityName-exists/:licensePlate/:id',
  AuthService.isAuthenticated(['admin']),
  verifyLicensePlateExists
);

vehicleRouter.get('/:id', AuthService.isAuthenticated(['admin']), findOne);

vehicleRouter.post(
  '/',
  AuthService.isAuthenticated(['admin']),
  sanitizedVehicleInput,
  add
);

vehicleRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  sanitizedVehicleInput,
  update
);

vehicleRouter.delete('/:id', AuthService.isAuthenticated(['admin']), remove);
