import { Router } from 'express'
import { sanitizedVehicleInput, findAll, findOne, add, update, remove, verifyLicensePlateExists } from './vehicle.controler.js'
import { AuthService } from '../shared/db/auth.service.js'

export const vehicleRouter = Router()

vehicleRouter.get('/', AuthService.isAuthenticated(["admin"]), findAll)
vehicleRouter.get('/:id', AuthService.isAuthenticated(["admin"]), findOne)
vehicleRouter.post('/', AuthService.isAuthenticated(["admin"]), sanitizedVehicleInput, add)
vehicleRouter.put('/:id', AuthService.isAuthenticated(["admin"]), sanitizedVehicleInput, update)
vehicleRouter.patch('/:id', AuthService.isAuthenticated(["admin"]), sanitizedVehicleInput, update)
vehicleRouter.delete('/:id', AuthService.isAuthenticated(["admin"]), remove)

vehicleRouter.get('/entityName-exists/:licensePlate/:id', AuthService.isAuthenticated(["admin"]), verifyLicensePlateExists)
