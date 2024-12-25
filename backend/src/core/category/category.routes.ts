// Express
import { Router } from 'express';

// Controllers
import {
  findAll,
  verifyCategoryNameExists,
  findOne,
  sanitizedCategoryInput,
  add,
  update,
  remove,
} from './category.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

export const categoryRouter = Router();

categoryRouter.get('/', AuthService.isAuthenticated(['admin']), findAll);

categoryRouter.get(
  '/entityName-exists/:categoryName/:id',
  AuthService.isAuthenticated(['admin']),
  verifyCategoryNameExists
);

categoryRouter.get('/:id', AuthService.isAuthenticated(['admin']), findOne);

categoryRouter.post(
  '/',
  AuthService.isAuthenticated(['admin']),
  sanitizedCategoryInput,
  add
);

categoryRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  sanitizedCategoryInput,
  update
);

categoryRouter.delete('/:id', AuthService.isAuthenticated(['admin']), remove);
