import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './vehicleModel.controler.js';

export const vehicleModelRouter = Router();

vehicleModelRouter.get('/', findAll);
vehicleModelRouter.get('/:id', findOne);
vehicleModelRouter.post('/', add);
vehicleModelRouter.put('/:id', update);
vehicleModelRouter.patch('/:id', update);
vehicleModelRouter.delete('/:id', remove);
