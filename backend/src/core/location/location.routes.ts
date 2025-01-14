// Express
import { Router } from 'express';

// Controllers
import {
  findAll,
  verifyLocationNameExists,
  findOne,
  sanitizedLocationInput,
  add,
  update,
  remove,
} from './location.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

export const locationRouter = Router();

locationRouter.get('/', findAll);

locationRouter.get(
  '/location-name-exists/:locationName/:id',
  AuthService.isAuthenticated(['admin']),
  verifyLocationNameExists
);

locationRouter.get('/:id', AuthService.isAuthenticated(['admin']), findOne);

locationRouter.post(
  '/',
  AuthService.isAuthenticated(['admin']),
  sanitizedLocationInput,
  add
);

locationRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  sanitizedLocationInput,
  update
);

locationRouter.delete('/:id', AuthService.isAuthenticated(['admin']), remove);
