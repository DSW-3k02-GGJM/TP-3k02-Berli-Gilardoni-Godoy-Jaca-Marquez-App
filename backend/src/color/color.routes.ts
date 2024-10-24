import { Router } from 'express';
import {findAll, findOne, add, update, remove, sanitizedColorInput} from './color.controler.js';
import { AuthService } from '../shared/db/auth.service.js';

export const colorRouter = Router();

colorRouter.get('/', AuthService.isAuthenticated(["admin"]), findAll);
colorRouter.get('/:id', AuthService.isAuthenticated(["admin"]), findOne);
colorRouter.post('/', AuthService.isAuthenticated(["admin"]), sanitizedColorInput, add);
colorRouter.put('/:id', AuthService.isAuthenticated(["admin"]), sanitizedColorInput, update);
colorRouter.patch('/:id', AuthService.isAuthenticated(["admin"]), sanitizedColorInput, update);
colorRouter.delete('/:id', AuthService.isAuthenticated(["admin"]), remove);
