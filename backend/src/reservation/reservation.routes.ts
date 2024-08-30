import { Router } from 'express';
import {
  sanitizedReservationInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './reservation.controler.js';

export const reservationRouter = Router();

reservationRouter.get('/', findAll);
reservationRouter.get('/:id', findOne);
reservationRouter.post('/', sanitizedReservationInput, add);
reservationRouter.put('/:id', sanitizedReservationInput, update);
reservationRouter.patch('/:id', sanitizedReservationInput, update);
reservationRouter.delete('/:id', remove);
