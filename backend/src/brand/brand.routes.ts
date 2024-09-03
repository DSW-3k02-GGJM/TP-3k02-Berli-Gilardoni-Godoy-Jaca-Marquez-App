import { Router } from "express";
import { sanitizedBrandInput, findAll, findOne, add, update, remove } from "./brand.controler.js";

export const brandRouter = Router()

brandRouter.get('/', findAll)
brandRouter.get('/:id', findOne)
brandRouter.post('/', sanitizedBrandInput , add)
brandRouter.put('/:id', sanitizedBrandInput , update)
brandRouter.patch('/:id', sanitizedBrandInput , update)
brandRouter.delete('/:id', remove)
