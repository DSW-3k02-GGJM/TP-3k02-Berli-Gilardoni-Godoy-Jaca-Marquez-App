import { Router } from 'express';
import {
  sanitizedCategoryInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './categoria.controler.js';

export const categoryRouter = Router();

categoryRouter.get('/', findAll);
categoryRouter.get('/:id', findOne);
categoryRouter.post('/', sanitizedCategoryInput, add);
categoryRouter.put('/:id', sanitizedCategoryInput, update);
categoryRouter.patch('/:id', sanitizedCategoryInput, update);
categoryRouter.delete('/:id', remove);
