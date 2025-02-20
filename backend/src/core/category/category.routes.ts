// Express
import { Router } from 'express';

// Controllers
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyCategoryNameExists,
} from './category.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

// Middlewares
import { sanitizedInput } from './category.middleware.js';

export const categoryRouter = Router();

categoryRouter.get('/', AuthService.isAuthenticated(['admin']), findAll);

categoryRouter.get(
  '/category-name-exists/:categoryName/:id',
  AuthService.isAuthenticated(['admin']),
  verifyCategoryNameExists
);

categoryRouter.get('/:id', AuthService.isAuthenticated(['admin']), findOne);

categoryRouter.post(
  '/',
  AuthService.isAuthenticated(['admin']),
  sanitizedInput,
  add
);

categoryRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  sanitizedInput,
  update
);

categoryRouter.delete('/:id', AuthService.isAuthenticated(['admin']), remove);
