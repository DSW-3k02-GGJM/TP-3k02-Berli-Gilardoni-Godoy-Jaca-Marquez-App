// Middlewares
import { sanitizeInput } from '../../shared/middlewares/sanitize-input.middleware.js';

const sanitizedRegisterInput = sanitizeInput({
  required: [
    'documentType',
    'documentID',
    'userName',
    'userSurname',
    'birthDate',
    'address',
    'phoneNumber',
    'nationality',
    'email',
    'password',
  ],
  date: ['birthDate'],
  email: ['email'],
  unique: ['documentID', 'email'],
  entity: 'User',
});

const sanitizedAdminInput = sanitizeInput({
  required: [
    'documentType',
    'documentID',
    'userName',
    'userSurname',
    'birthDate',
    'address',
    'phoneNumber',
    'nationality',
    'email',
    'password',
    'role',
    'verified',
  ],
  date: ['birthDate'],
  email: ['email'],
  role: ['admin', 'employee', 'client'],
  unique: ['documentID', 'email'],
  entity: 'User',
});

const sanitizedUpdateInput = sanitizeInput({
  required: [
    'documentType',
    'documentID',
    'userName',
    'userSurname',
    'birthDate',
    'address',
    'phoneNumber',
    'nationality',
    'role',
    'verified',
  ],
  date: ['birthDate'],
  role: ['admin', 'employee', 'client'],
  unique: ['documentID'],
  entity: 'User',
});

const sanitizedLoginInput = sanitizeInput({
  required: ['email', 'password'],
  email: ['email'],
});

const sanitizedEmailInput = sanitizeInput({ required: ['subject', 'message'] });

const sanitizedPasswordResetInput = sanitizeInput({
  required: ['newPassword', 'confirmPassword'],
  match: { newPassword: 'confirmPassword' },
});

export {
  sanitizedRegisterInput,
  sanitizedAdminInput,
  sanitizedUpdateInput,
  sanitizedLoginInput,
  sanitizedEmailInput,
  sanitizedPasswordResetInput,
};
