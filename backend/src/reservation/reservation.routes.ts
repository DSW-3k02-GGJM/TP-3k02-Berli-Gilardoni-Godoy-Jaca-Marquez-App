import { Router } from 'express';
import {
  sanitizedReservationInput,
  sanitizedAdminReservationInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  reservation,
  sanitizedUserReservationInput,
  getReservationsByUser,
} from './reservation.controler.js';
import { AuthService } from '../shared/db/auth.service.js';

export const reservationRouter = Router();

reservationRouter.get(
  '/',
  AuthService.isAuthenticated(['admin', 'employee']),
  findAll
);
reservationRouter.get(
  '/user-reservations',
  AuthService.isAuthenticated(['client']),
  getReservationsByUser
);
reservationRouter.get(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee']),
  findOne
);
reservationRouter.post(
  '/',
  AuthService.isAuthenticated(['admin', 'employee']),
  sanitizedReservationInput,
  add
);
reservationRouter.post(
  '/createAdminReservation',
  AuthService.isAuthenticated(['admin', 'employee']),
  sanitizedAdminReservationInput,
  add
);
reservationRouter.post(
  '/createUserReservation',
  AuthService.isAuthenticated(['admin', 'employee', 'client']),
  sanitizedUserReservationInput,
  reservation
);
reservationRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee', 'client']),
  sanitizedReservationInput,
  update
);
reservationRouter.patch(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee', 'client']),
  sanitizedReservationInput,
  update
);
reservationRouter.delete(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee']),
  remove
);
