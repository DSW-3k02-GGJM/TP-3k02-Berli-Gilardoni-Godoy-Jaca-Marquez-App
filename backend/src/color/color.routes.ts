import { Router } from 'express';
import { findAll, findOne, add, update, remove } from './color.controler.js';

export const colorRouter = Router();

colorRouter.get('/', findAll);
colorRouter.get('/:id', findOne);
colorRouter.post('/', add);
colorRouter.put('/:id', update);
colorRouter.patch('/:id', update);
colorRouter.delete('/:id', remove);
