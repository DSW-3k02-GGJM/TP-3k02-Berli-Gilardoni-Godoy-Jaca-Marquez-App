// Express
import { Router } from 'express';

// Controllers
import {
  sanitizedLoginInput,
  sanitizedUserInput,
  login,
  logout,
  register,
  sendEmailVerification,
  verifyEmailToken,
  sendPasswordReset,
  sanitizedPasswordResetInput,
  verifyPasswordResetToken,
  getAuthenticatedId,
  getAuthenticatedRole,
  verifyAuthentication,
  sendEmail,
  verifyEmailExists,
  verifyDocumentIDExists,
  findAll,
  add,
  findOne,
  update,
  sanitizedPartialUpdateInput,
  remove,
} from './user.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

export const userRouter = Router();

userRouter.post('/login', sanitizedLoginInput, login);

userRouter.post('/logout', logout);

userRouter.post('/register', sanitizedUserInput, register);

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
  sanitizedUserInput,
  add
);

userRouter.get('/:id', findOne);

userRouter.put('/:id', sanitizedUserInput, update);

userRouter.patch('/:id', sanitizedPartialUpdateInput, update);

userRouter.delete('/:id', AuthService.isAuthenticated(['admin']), remove);
