import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './modelo.controler.js';

export const modeloRouter = Router();

modeloRouter.get('/', findAll);
modeloRouter.get('/:id', findOne);
modeloRouter.post('/', add);
modeloRouter.put('/:id', update);
modeloRouter.patch('/:id', update);
modeloRouter.delete('/:id', remove);
