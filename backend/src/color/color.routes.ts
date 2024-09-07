import { Router } from 'express';
import {findAll, findOne, add, update, remove, sanitizedColorInput} from './color.controler.js';

export const colorRouter = Router();

colorRouter.get('/', findAll);
colorRouter.get('/:id', findOne);
colorRouter.post('/', sanitizedColorInput, add);
colorRouter.put('/:id', sanitizedColorInput, update);
colorRouter.patch('/:id', sanitizedColorInput, update);
colorRouter.delete('/:id', remove);
