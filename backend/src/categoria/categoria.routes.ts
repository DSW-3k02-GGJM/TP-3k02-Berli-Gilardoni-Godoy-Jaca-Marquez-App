import { Router } from 'express';
import {
  sanitizedCategoriaInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './categoria.controler.js';

export const categoriaRouter = Router();

categoriaRouter.get('/', findAll);
categoriaRouter.get('/:id', findOne);
categoriaRouter.post('/', sanitizedCategoriaInput, add);
categoriaRouter.put('/:id', sanitizedCategoriaInput, update);
categoriaRouter.patch('/:id', sanitizedCategoriaInput, update);
categoriaRouter.delete('/:id', remove);
