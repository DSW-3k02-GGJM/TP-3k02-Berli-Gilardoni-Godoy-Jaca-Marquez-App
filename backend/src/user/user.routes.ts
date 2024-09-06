import { Router } from "express";
import { sanitizedUserInput, findAll, findOne, update, remove, register, login, logout, verifyAuthentication, verifyEmailExists } from "./user.controller.js";
import { AuthService } from "../shared/db/auth.service.js";

export const userRouter = Router()

userRouter.get('/', AuthService.isAuthenticated , findAll) // Se fija si el usuario está autenticado
userRouter.get('/:id', findOne)
userRouter.put('/:id', sanitizedUserInput , update)
userRouter.patch('/:id', sanitizedUserInput , update)
userRouter.delete('/:id', remove)
userRouter.post('/register', sanitizedUserInput , register)
userRouter.post('/login', sanitizedUserInput , login)
userRouter.post('/logout', sanitizedUserInput , logout)
userRouter.post('/is-authenticated', AuthService.isAuthenticated , verifyAuthentication)
userRouter.get('/email-exists/:email', verifyEmailExists)