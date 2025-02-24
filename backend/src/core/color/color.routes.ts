// Express
import { Router } from 'express';

// Controllers
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyColorNameExists,
} from './color.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

// Middlewares
import { sanitizedInput } from './color.middleware.js';

export const colorRouter = Router();

colorRouter.get('/', AuthService.isAuthenticated(['admin']), findAll);

colorRouter.get(
  '/color-name-exists/:colorName/:id',
  AuthService.isAuthenticated(['admin']),
  verifyColorNameExists
);

colorRouter.get('/:id', AuthService.isAuthenticated(['admin']), findOne);

colorRouter.post(
  '/',
  AuthService.isAuthenticated(['admin']),
  sanitizedInput,
  add
);

colorRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  sanitizedInput,
  update
);

colorRouter.delete('/:id', AuthService.isAuthenticated(['admin']), remove);
