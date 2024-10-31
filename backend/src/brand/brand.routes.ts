import { Router } from "express";
import { sanitizedBrandInput, findAll, findOne, add, update, remove, verifyBrandNameExists } from "./brand.controler.js";
import { AuthService } from "../shared/db/auth.service.js";


export const brandRouter = Router()

brandRouter.get('/', AuthService.isAuthenticated(["admin"]), findAll)
brandRouter.get('/:id', AuthService.isAuthenticated(["admin"]), findOne)
brandRouter.post('/', AuthService.isAuthenticated(["admin"]), sanitizedBrandInput , add)
brandRouter.put('/:id', AuthService.isAuthenticated(["admin"]), sanitizedBrandInput , update)
//brandRouter.patch('/:id', AuthService.isAuthenticated(["admin"]), sanitizedBrandInput , update)
brandRouter.delete('/:id', AuthService.isAuthenticated(["admin"]), remove)

brandRouter.get('/entityName-exists/:brandName/:id', AuthService.isAuthenticated(["admin"]), verifyBrandNameExists)
