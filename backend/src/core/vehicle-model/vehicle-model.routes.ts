// Express
import { Router } from 'express';

// Controllers
import {
  findAll,
  findOne,
  verifyVehicleModelNameExists,
  sanitizedVehicleModelInput,
  add,
  update,
  remove,
} from './vehicle-model.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

export const vehicleModelRouter = Router();

vehicleModelRouter.get('/', AuthService.isAuthenticated(['admin']), findAll);

vehicleModelRouter.get('/:id', AuthService.isAuthenticated(['admin']), findOne);

vehicleModelRouter.get(
  '/entityName-exists/:vehicleModelName/:id',
  AuthService.isAuthenticated(['admin']),
  verifyVehicleModelNameExists
);

vehicleModelRouter.post(
  '/',
  AuthService.isAuthenticated(['admin']),
  sanitizedVehicleModelInput,
  add
);

vehicleModelRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  sanitizedVehicleModelInput,
  update
);

vehicleModelRouter.delete(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  remove
);
