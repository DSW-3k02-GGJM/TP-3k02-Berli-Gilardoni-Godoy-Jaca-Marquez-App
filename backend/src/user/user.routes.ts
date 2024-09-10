import { Router } from "express";
import { sanitizedUserInput, findAll, findOne, update, remove, register, login, logout, verifyAuthentication, verifyEmailExists } from "./user.controller.js";
import { AuthService } from "../shared/db/auth.service.js";

export const userRouter = Router()

userRouter.get('/' , AuthService.isAuthenticated(["admin","employee"]) ,findAll) // Se fija si el usuario está autenticado
userRouter.get('/:id', findOne)
userRouter.put('/:id', sanitizedUserInput , update)
userRouter.patch('/:id', sanitizedUserInput , update)
userRouter.delete('/:id', remove)
userRouter.post('/register', sanitizedUserInput , register)
userRouter.post('/login', sanitizedUserInput , login)
userRouter.post('/logout', sanitizedUserInput , logout)
userRouter.post('/is-authenticated', AuthService.isAuthenticated(["employee","client","admin"]) , verifyAuthentication)
userRouter.get('/email-exists/:email', verifyEmailExists)
userRouter.post('/admin', AuthService.isAuthenticated(['admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome admin' });
});
userRouter.post('/employee', AuthService.isAuthenticated(['employee']), (req, res) => {
    res.status(200).json({ message: 'Welcome employee' });
});
userRouter.post('/client', AuthService.isAuthenticated(['client']), (req, res) => {
    res.status(200).json({ message: 'Welcome client' });
});