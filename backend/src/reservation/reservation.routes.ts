import { Router } from 'express';
import {
  sanitizedAdminReservationInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  reservation,
  sanitizedUserReservationInput,
} from './reservation.controler.js';
import { AuthService } from '../shared/db/auth.service.js';

export const reservationRouter = Router();

reservationRouter.get(
  '/',
  AuthService.isAuthenticated(['admin', 'employee']),
  findAll
);
reservationRouter.get(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee']),
  findOne
);
reservationRouter.post(
  '/',
  AuthService.isAuthenticated(['admin', 'employee']),
  sanitizedAdminReservationInput,
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
  AuthService.isAuthenticated(['admin', 'employee']),
  sanitizedAdminReservationInput,
  update
);
reservationRouter.patch(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee']),
  sanitizedAdminReservationInput,
  update
);
reservationRouter.delete(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee']),
  remove
);
