import { Router } from 'express';
import {
  sanitizedAlquilerInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './alquiler.controler.js';

export const reservationRouter = Router();

reservationRouter.get('/', findAll);
reservationRouter.get('/:id', findOne);
reservationRouter.post('/', sanitizedAlquilerInput, add);
reservationRouter.put('/:id', sanitizedAlquilerInput, update);
reservationRouter.patch('/:id', sanitizedAlquilerInput, update);
reservationRouter.delete('/:id', remove);
