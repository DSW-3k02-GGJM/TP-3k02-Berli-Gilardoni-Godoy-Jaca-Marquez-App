import { Router } from "express";
import { sanitizedUsuarioInput, findAll, findOne, update, remove, register, login } from "./usuario.controller.js";

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/:id', findOne)
usuarioRouter.put('/:id', sanitizedUsuarioInput , update)
usuarioRouter.patch('/:id', sanitizedUsuarioInput , update)
usuarioRouter.delete('/:id', remove)
usuarioRouter.post('/register', sanitizedUsuarioInput , register)
usuarioRouter.post('/login', sanitizedUsuarioInput , login)