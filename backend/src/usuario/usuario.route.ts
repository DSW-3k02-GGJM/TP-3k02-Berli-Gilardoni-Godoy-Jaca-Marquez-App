import { Router } from "express";
import { sanitizedUsuarioInput, findAll, findOne, update, remove, register, login, logout } from "./usuario.controller.js";
import { AuthService } from "../shared/db/auth.service.js";

export const usuarioRouter = Router()

usuarioRouter.get('/', AuthService.isAuthenticated , findAll)
usuarioRouter.get('/:id', findOne)
usuarioRouter.put('/:id', sanitizedUsuarioInput , update)
usuarioRouter.patch('/:id', sanitizedUsuarioInput , update)
usuarioRouter.delete('/:id', remove)
usuarioRouter.post('/register', sanitizedUsuarioInput , register)
usuarioRouter.post('/login', sanitizedUsuarioInput , login)
usuarioRouter.post('/logout', sanitizedUsuarioInput , logout)