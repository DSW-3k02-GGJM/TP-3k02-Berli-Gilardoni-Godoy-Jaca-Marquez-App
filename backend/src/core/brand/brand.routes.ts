// Express
import { Router } from 'express';

// Controllers
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyBrandNameExists,
} from './brand.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

// Middlewares
import { sanitizedInput } from './brand.middleware.js';

export const brandRouter = Router();

brandRouter.get('/', AuthService.isAuthenticated(['admin']), findAll);

brandRouter.get(
  '/brand-name-exists/:brandName/:id',
  AuthService.isAuthenticated(['admin']),
  verifyBrandNameExists
);

brandRouter.get('/:id', AuthService.isAuthenticated(['admin']), findOne);

brandRouter.post(
  '/',
  AuthService.isAuthenticated(['admin']),
  sanitizedInput,
  add
);

brandRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  sanitizedInput,
  update
);

brandRouter.delete('/:id', AuthService.isAuthenticated(['admin']), remove);
