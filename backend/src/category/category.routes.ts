import { Router } from 'express';
import {add, findAll, findOne, remove, sanitizedCategoryInput, update} from "./category.controler.js";


export const categoryRouter = Router();

categoryRouter.get('/', findAll);
categoryRouter.get('/:id', findOne);
categoryRouter.post('/', sanitizedCategoryInput, add);
categoryRouter.put('/:id', sanitizedCategoryInput, update);
categoryRouter.patch('/:id', sanitizedCategoryInput, update);
categoryRouter.delete('/:id', remove);
