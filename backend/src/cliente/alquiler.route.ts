import { Router } from "express";
import { sanitizedClienteInput, findAll, findOne, add, update, remove } from "./alquiler.controler.js";

export const alquilerRouter = Router()

alquilerRouter.get('/', findAll)
alquilerRouter.get('/:id', findOne)
alquilerRouter.post('/', sanitizedClienteInput , add)
alquilerRouter.put('/:id', sanitizedClienteInput , update)
alquilerRouter.patch('/:id', sanitizedClienteInput , update)
alquilerRouter.delete('/:id', remove)