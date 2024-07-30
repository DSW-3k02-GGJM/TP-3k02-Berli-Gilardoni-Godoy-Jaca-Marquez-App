import { Router } from "express";
import { sanitizedMarcaInput, findAll, findOne, add, update, remove } from "./marca.controler.js";

export const marcaRouter = Router()

marcaRouter.get('/', findAll)
marcaRouter.get('/:id', findOne)
marcaRouter.post('/', sanitizedMarcaInput , add)
marcaRouter.put('/:id', sanitizedMarcaInput , update)
marcaRouter.patch('/:id', sanitizedMarcaInput , update)
marcaRouter.delete('/:id', remove)
