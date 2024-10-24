import { Router } from 'express';
import {findAll, findOne, add, update, remove, sanitizedLocationInput} from './location.controler.js';
import { AuthService } from '../shared/db/auth.service.js';

export const locationRouter = Router();

locationRouter.get('/', AuthService.isAuthenticated(["admin"]), findAll);
locationRouter.get('/:id', AuthService.isAuthenticated(["admin"]), findOne);
locationRouter.post('/', AuthService.isAuthenticated(["admin"]), sanitizedLocationInput, add);
locationRouter.put('/:id', AuthService.isAuthenticated(["admin"]), sanitizedLocationInput, update);
//locationRouter.patch('/:id', AuthService.isAuthenticated(["admin"]), sanitizedLocationInput, update);
locationRouter.delete('/:id', AuthService.isAuthenticated(["admin"]), remove);
