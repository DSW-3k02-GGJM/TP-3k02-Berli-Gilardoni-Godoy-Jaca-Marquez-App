import { Router } from 'express';
import {add, findAll, findOne, remove, sanitizedCategoryInput, update} from "./category.controler.js";
import { AuthService } from '../shared/db/auth.service.js';


export const categoryRouter = Router();

categoryRouter.get('/', AuthService.isAuthenticated(["admin"]), findAll);
categoryRouter.get('/:id', AuthService.isAuthenticated(["admin"]), findOne);
categoryRouter.post('/', AuthService.isAuthenticated(["admin"]), sanitizedCategoryInput, add);
categoryRouter.put('/:id', AuthService.isAuthenticated(["admin"]), sanitizedCategoryInput, update);
//categoryRouter.patch('/:id', AuthService.isAuthenticated(["admin"]), sanitizedCategoryInput, update);
categoryRouter.delete('/:id', AuthService.isAuthenticated(["admin"]), remove);
