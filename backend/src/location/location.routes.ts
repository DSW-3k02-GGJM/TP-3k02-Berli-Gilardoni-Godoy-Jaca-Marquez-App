import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './location.controler.js';

export const locationRouter = Router();

locationRouter.get('/', findAll);
locationRouter.get('/:id', findOne);
locationRouter.post('/', add);
locationRouter.put('/:id', update);
locationRouter.patch('/:id', update);
locationRouter.delete('/:id', remove);
