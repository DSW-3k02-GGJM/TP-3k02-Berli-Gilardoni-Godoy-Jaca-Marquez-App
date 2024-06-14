import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./vehiculoModelo.controler.js";

export const vehiculoModeloRouter = Router()

vehiculoModeloRouter.get('/', findAll)
vehiculoModeloRouter.get('/:id', findOne)
vehiculoModeloRouter.post('/', add)
vehiculoModeloRouter.put('/:id', update)
vehiculoModeloRouter.patch('/:id', update)
vehiculoModeloRouter.delete('/:id', remove)
