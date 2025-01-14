// Express
import { Router } from 'express';

// Controllers
import {
  findAll,
  verifyColorNameExists,
  findOne,
  sanitizedColorInput,
  add,
  update,
  remove,
} from './color.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

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
  sanitizedColorInput,
  add
);

colorRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  sanitizedColorInput,
  update
);

colorRouter.delete('/:id', AuthService.isAuthenticated(['admin']), remove);
