import { Router } from "express";
import { sanitizedClienteInput, findAll, findOne, add, update, remove } from "./marca.controler.js";

export const clienteRouter = Router()

clienteRouter.get('/', findAll)
clienteRouter.get('/:id', findOne)
clienteRouter.post('/', sanitizedClienteInput , add)
clienteRouter.put('/:id', sanitizedClienteInput , update)
clienteRouter.patch('/:id', sanitizedClienteInput , update)
clienteRouter.delete('/:id', remove)
