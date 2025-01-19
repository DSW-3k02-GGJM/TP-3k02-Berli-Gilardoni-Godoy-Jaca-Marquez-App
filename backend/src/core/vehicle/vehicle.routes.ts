// Express
import { Router } from 'express';

// Controllers
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyLicensePlateExists,
  findAvailable,
} from './vehicle.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

// Middlewares
import { sanitizedFilterInput, sanitizedInput } from './vehicle.middleware.js';

export const vehicleRouter = Router();

vehicleRouter.get('/available', sanitizedFilterInput, findAvailable);

vehicleRouter.get('/', AuthService.isAuthenticated(['admin']), findAll);

vehicleRouter.get(
  '/license-plate-exists/:licensePlate/:id',
  AuthService.isAuthenticated(['admin']),
  verifyLicensePlateExists
);

vehicleRouter.get('/:id', AuthService.isAuthenticated(['admin']), findOne);

vehicleRouter.post(
  '/',
  AuthService.isAuthenticated(['admin']),
  sanitizedInput,
  add
);

vehicleRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  sanitizedInput,
  update
);

vehicleRouter.delete('/:id', AuthService.isAuthenticated(['admin']), remove);
