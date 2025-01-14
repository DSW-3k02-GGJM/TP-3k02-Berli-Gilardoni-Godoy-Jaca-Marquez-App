// Express
import { Router } from 'express';

// Controllers
import { add, remove } from './upload.controller.js';

// Services
import { AuthService } from '../shared/services/auth.service.js';

export const uploadRouter = Router();

uploadRouter.post('/', AuthService.isAuthenticated(['admin']), add);

uploadRouter.delete(
  '/:filename',
  AuthService.isAuthenticated(['admin']),
  remove
);
