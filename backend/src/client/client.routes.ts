import { Router } from "express";
import { sanitizedClientInput, findAll, findOne, add, update, remove } from "./client.controler.js";

export const clientRouter = Router()

clientRouter.get('/', findAll)
clientRouter.get('/:id', findOne)
clientRouter.post('/', sanitizedClientInput , add)
clientRouter.put('/:id', sanitizedClientInput , update)
clientRouter.patch('/:id', sanitizedClientInput , update)
clientRouter.delete('/:id', remove)
