import { Router } from 'express';
import {
  sanitizedNewUser,
  sanitizedLoginInput,
  sanitizedUserInput,
  add,
  findAll,
  findOne,
  update,
  remove,
  register,
  login,
  logout,
  verifyAuthentication,
  verifyEmailExists,
  verifyDocumentIDExists,
  getAuthenticatedId,
  getAuthenticatedRole,
  mailExample,
  sendEmailVerification,
  staffUpdate,
  verifyEmailToken,
  sendPasswordReset,
  sanitizedPasswordResetInput,
  verifyPasswordResetToken,
  sendEmail,
} from './user.controller.js';
import { AuthService } from '../shared/db/auth.service.js';

export const userRouter = Router();

userRouter.get(
  '/',
  AuthService.isAuthenticated(['admin', 'employee']),
  findAll
); // Se fija si el usuario está autenticado
userRouter.post('/', AuthService.isAuthenticated(["admin"]) ,sanitizedNewUser, add);
userRouter.get('/:id', findOne);
userRouter.put('/:id', sanitizedUserInput, update);
userRouter.patch('/:id', sanitizedUserInput, update);
userRouter.patch('/staff-update/:id', AuthService.isAuthenticated(["admin"]) , sanitizedUserInput, staffUpdate);
userRouter.delete('/:id', AuthService.isAuthenticated(["admin"]) , remove);
userRouter.post('/register', sanitizedUserInput, register);
userRouter.post('/login', sanitizedLoginInput, login);
userRouter.post('/logout', logout);
userRouter.post('/mail-example', mailExample);

userRouter.post('/send-email-verification/:email', sendEmailVerification);
userRouter.post('/verify-email-token/:token', verifyEmailToken);
userRouter.post('/send-email/:email', AuthService.isAuthenticated(["admin","employee"]) ,sendEmail);

userRouter.post('/send-password-reset/:email', sendPasswordReset);
userRouter.post('/verify-password-reset-token/:token', sanitizedPasswordResetInput ,verifyPasswordResetToken);

userRouter.post(
  '/is-authenticated',
  AuthService.isAuthenticated(['employee', 'client', 'admin']),
  verifyAuthentication
);
userRouter.get('/email-exists/:email', verifyEmailExists);
userRouter.get('/documentID-exists/:documentID/:id', verifyDocumentIDExists);
userRouter.post(
  '/admin',
  AuthService.isAuthenticated(['admin']),
  verifyAuthentication
);
userRouter.post(
  '/employee',
  AuthService.isAuthenticated(['employee', 'admin']),
  verifyAuthentication
);
userRouter.post(
  '/client',
  AuthService.isAuthenticated(['employee', 'client', 'admin']),
  verifyAuthentication
);
userRouter.post(
  '/authenticated-id',
  AuthService.isAuthenticated(['employee', 'client', 'admin']),
  getAuthenticatedId
);
userRouter.post(
  '/authenticated-role',
  AuthService.isAuthenticated(['employee', 'client', 'admin']),
  getAuthenticatedRole
);
