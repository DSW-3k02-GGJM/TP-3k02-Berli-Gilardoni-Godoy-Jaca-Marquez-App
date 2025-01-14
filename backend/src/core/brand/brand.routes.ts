// Express
import { Router } from 'express';

// Controllers
import {
  findAll,
  verifyBrandNameExists,
  findOne,
  sanitizedBrandInput,
  add,
  update,
  remove,
} from './brand.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

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
  sanitizedBrandInput,
  add
);

brandRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin']),
  sanitizedBrandInput,
  update
);

brandRouter.delete('/:id', AuthService.isAuthenticated(['admin']), remove);
