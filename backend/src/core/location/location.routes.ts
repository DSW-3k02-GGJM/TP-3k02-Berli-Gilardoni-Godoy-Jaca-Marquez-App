// Express
import { Router } from 'express';

// Controllers
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyLocationNameExists,
} from './location.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

// Middlewares
import { sanitizedInput } from './location.middleware.js';

export const locationRouter = Router();

locationRouter.get(
  '/',
  AuthService.isAuthenticated(['admin', 'employee', 'client']),
  findAll
);

locationRouter.get(
  '/location-name-exists/:locationName/:id',
  AuthService.isAuthenticated(['admin']),
  verifyLocationNameExists
);

locationRouter.get('/:id', AuthService.isAuthenticated(['admin']), findOne);

locationRouter.post(
  '/',
  AuthService.isAuthenticated(['admin']),
  sanitizedInput,
  add
);

locationRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  sanitizedInput,
  update
);

locationRouter.delete('/:id', AuthService.isAuthenticated(['admin']), remove);
