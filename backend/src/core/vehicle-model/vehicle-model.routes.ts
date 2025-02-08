// Express
import { Router } from 'express';

// Controllers
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyVehicleModelNameExists,
} from './vehicle-model.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

// Middlewares
import { sanitizedInput } from './vehicle-model.middleware.js';

export const vehicleModelRouter = Router();

vehicleModelRouter.get('/', AuthService.isAuthenticated(['admin']), findAll);

vehicleModelRouter.get('/:id', AuthService.isAuthenticated(['admin']), findOne);

vehicleModelRouter.get(
  '/vehicle-model-name-exists/:vehicleModelName/:id',
  AuthService.isAuthenticated(['admin']),
  verifyVehicleModelNameExists
);

vehicleModelRouter.post(
  '/',
  AuthService.isAuthenticated(['admin']),
  sanitizedInput,
  add
);

vehicleModelRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  sanitizedInput,
  update
);

vehicleModelRouter.delete(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  remove
);
