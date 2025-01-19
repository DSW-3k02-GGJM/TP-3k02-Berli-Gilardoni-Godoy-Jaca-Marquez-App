// Express
import { Router } from 'express';

// Controllers
import {
  findAll,
  add,
  update,
  remove,
  getReservationsByUser,
  userReservation,
} from './reservation.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

// Middlewares
import {
  sanitizedAdminInput,
  sanitizedUserInput,
  sanitizedUpdateInput,
} from './reservation.middleware.js';

export const reservationRouter = Router();

reservationRouter.get(
  '/user-reservations',
  AuthService.isAuthenticated(['client']),
  getReservationsByUser
);

reservationRouter.get(
  '/',
  AuthService.isAuthenticated(['admin', 'employee']),
  findAll
);

reservationRouter.post(
  '/create-admin-reservation',
  AuthService.isAuthenticated(['admin', 'employee']),
  sanitizedAdminInput,
  add
);

reservationRouter.post(
  '/create-user-reservation',
  AuthService.isAuthenticated(['admin', 'employee', 'client']),
  sanitizedUserInput,
  userReservation
);

reservationRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee', 'client']),
  sanitizedUpdateInput,
  update
);

reservationRouter.delete(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee']),
  remove
);
