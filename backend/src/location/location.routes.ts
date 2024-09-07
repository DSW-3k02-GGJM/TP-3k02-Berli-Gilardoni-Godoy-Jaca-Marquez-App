import { Router } from 'express';
import {findAll, findOne, add, update, remove, sanitizedLocationInput} from './location.controler.js';

export const locationRouter = Router();

locationRouter.get('/', findAll);
locationRouter.get('/:id', findOne);
locationRouter.post('/', sanitizedLocationInput, add);
locationRouter.put('/:id', sanitizedLocationInput, update);
locationRouter.patch('/:id', sanitizedLocationInput, update);
locationRouter.delete('/:id', remove);
