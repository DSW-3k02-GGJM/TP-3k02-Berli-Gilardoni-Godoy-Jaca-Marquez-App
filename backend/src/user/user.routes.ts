import { Router } from "express";
import { sanitizedUserInput, findAll, findOne, update, remove, register, login, logout, verifyAuthentication, verifyEmailExists, verifyDocumentIDExists} from "./user.controller.js";
import { AuthService } from "../shared/db/auth.service.js";

export const userRouter = Router()

userRouter.get('/' , AuthService.isAuthenticated(["admin","employee"]) ,findAll) // Se fija si el usuario está autenticado
userRouter.get('/:id', findOne)
userRouter.put('/:id', sanitizedUserInput , update)
userRouter.patch('/:id', sanitizedUserInput , update)
userRouter.delete('/:id', remove)
userRouter.post('/register', sanitizedUserInput , register)
userRouter.post('/login', sanitizedUserInput , login)
userRouter.post('/logout', logout)
userRouter.post('/is-authenticated', AuthService.isAuthenticated(["employee","client","admin"]) , verifyAuthentication)
userRouter.get('/email-exists/:email', verifyEmailExists)
userRouter.get('/documentID-exists/:documentID', verifyDocumentIDExists)
userRouter.post('/admin', AuthService.isAuthenticated(["admin"]), verifyAuthentication)
userRouter.post('/employee', AuthService.isAuthenticated(["employee","admin"]), verifyAuthentication)
userRouter.post('/client', AuthService.isAuthenticated(["employee","client","admin"]), verifyAuthentication)
