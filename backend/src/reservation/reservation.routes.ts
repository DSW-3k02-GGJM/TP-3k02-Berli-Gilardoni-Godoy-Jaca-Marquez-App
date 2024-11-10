import { Router } from 'express';
import {
  sanitizedReservationInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  reservation,
  sanitizeUserdReservationInput,
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
  sanitizedReservationInput,
  add
);

reservationRouter.post(
  '/createUserReservation',
  AuthService.isAuthenticated(['admin', 'employee','client']),
  sanitizeUserdReservationInput,
  reservation
);
reservationRouter.put(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee']),
  sanitizedReservationInput,
  update
);
reservationRouter.patch(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee']),
  sanitizedReservationInput,
  update
);
reservationRouter.delete(
  '/:id',
  AuthService.isAuthenticated(['admin', 'employee']),
  remove
);
