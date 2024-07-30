import { Router } from 'express';
import {
  sanitizedAlquilerInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './alquiler.controler.js';

export const alquilerRouter = Router();

alquilerRouter.get('/', findAll);
alquilerRouter.get('/:id', findOne);
alquilerRouter.post('/', sanitizedAlquilerInput, add);
alquilerRouter.put('/:id', sanitizedAlquilerInput, update);
alquilerRouter.patch('/:id', sanitizedAlquilerInput, update);
alquilerRouter.delete('/:id', remove);
