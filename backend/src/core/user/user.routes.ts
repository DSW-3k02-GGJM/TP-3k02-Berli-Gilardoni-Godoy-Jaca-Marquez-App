// Express
import { Router } from 'express';

// Controllers
import {
  add,
  findAll,
  findOne,
  update,
  remove,
  register,
  login,
  logout,
  verifyAuthentication,
  getAuthenticatedId,
  getAuthenticatedRole,
  sendEmailVerification,
  verifyEmailToken,
  sendPasswordReset,
  verifyPasswordResetToken,
  verifyEmailExists,
  verifyDocumentIDExists,
  sendEmail,
} from './user.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

// Middlewares
import {
  sanitizedRegisterInput,
  sanitizedAdminInput,
  sanitizedUpdateInput,
  sanitizedLoginInput,
  sanitizedEmailInput,
  sanitizedPasswordResetInput,
} from './user.middleware.js';

export const userRouter = Router();

userRouter.post('/login', sanitizedLoginInput, login);

userRouter.post('/logout', logout);

userRouter.post('/register', sanitizedRegisterInput, register);

userRouter.post('/send-email-verification/:email', sendEmailVerification);

userRouter.post('/verify-email-token/:token', verifyEmailToken);

userRouter.post('/send-password-reset/:email', sendPasswordReset);

userRouter.post('/is-authenticated', verifyAuthentication);

userRouter.post(
  '/verify-password-reset-token/:token',
  sanitizedPasswordResetInput,
  verifyPasswordResetToken
);

userRouter.post(
  '/authenticated-id',
  AuthService.isAuthenticated(['admin', 'employee', 'client']),
  getAuthenticatedId
);

userRouter.post(
  '/authenticated-role',
  AuthService.isAuthenticated(['admin', 'employee', 'client']),
  getAuthenticatedRole
);

userRouter.post(
  '/send-email/:email',
  AuthService.isAuthenticated(['admin', 'employee']),
  sanitizedEmailInput,
  sendEmail
);

userRouter.get('/email-exists/:email', verifyEmailExists);

userRouter.get('/document-id-exists/:documentID/:id', verifyDocumentIDExists);

userRouter.get(
  '/',
  AuthService.isAuthenticated(['admin', 'employee']),
  findAll
);

userRouter.post(
  '/',
  AuthService.isAuthenticated(['admin']),
  sanitizedAdminInput,
  add
);

userRouter.get('/:id', findOne);

userRouter.put('/:id', sanitizedUpdateInput, update);

userRouter.delete('/:id', AuthService.isAuthenticated(['admin']), remove);
