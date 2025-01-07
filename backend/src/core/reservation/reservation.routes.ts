// Express
import { Router } from 'express';

// Controllers
import {
  getReservationsByUser,
  findAll,
  sanitizedAdminReservationInput,
  add,
  sanitizedUserReservationInput,
  userReservation,
  sanitizedUpdateReservationInput,
  update,
  remove,
} from './reservation.controller.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';

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
  sanitizedAdminReservationInput,
  add
);

reservationRouter.post(
  '/create-user-reservation',
  AuthService.isAuthenticated(['admin', 'employee', 'client']),
  sanitizedUserReservationInput,
  userReservation
);

reservationRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee', 'client']),
  sanitizedUpdateReservationInput,
  update
);

reservationRouter.delete(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee']),
  remove
);
