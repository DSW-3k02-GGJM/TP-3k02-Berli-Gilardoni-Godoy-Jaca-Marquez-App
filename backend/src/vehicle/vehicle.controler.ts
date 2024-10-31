import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Vehicle } from './vehicle.entity.js';
import { Reservation } from '../reservation/reservation.entity.js';

const em = orm.em;

const sanitizedVehicleInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    licensePlate: req.body.licensePlate,
    manufacturingYear: req.body.manufacturingYear,
    totalKms: req.body.totalKms,
    location: req.body.location,
    color: req.body.color,
    vehicleModel: req.body.vehicleModel,
    reservations: req.body.reservations,
  };
  // Más validaciones
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const id = Number.parseInt(req.params.id);
  const licensePlate = req.body.sanitizedInput.licensePlate;
  const manufacturingYear = req.body.sanitizedInput.manufacturingYear;
  const totalKms = req.body.sanitizedInput.totalKms;
  const location = req.body.sanitizedInput.location;
  const color = req.body.sanitizedInput.color;
  const vehicleModel = req.body.sanitizedInput.vehicleModel;

  if (!licensePlate || !manufacturingYear || !totalKms || !location || !color || !vehicleModel) {
    return res.status(400).json({ message: 'All information is required' });
  }

  if (totalKms < 0) { 
    return res.status(400).json({ message: 'Total kms must be greater than 0' });
  }

  const vehicle = await em.findOne( Vehicle , { licensePlate } , {populate: [] , });
  if (vehicle) {
    if (vehicle.id !== id) {
      return res.status(400).json({ message: 'This license plate is already used' });
    }
  }

  next();
};

const findAll = async (req: Request, res: Response) => {
  try {
    const vehicles = await em.find(
      Vehicle,
      {},
      {
        populate: [
          'location',
          'color',
          'vehicleModel',
          'vehicleModel.category',
          'vehicleModel.brand',
          'reservations',
          'reservations.client',
        ],
      }
    );
    res
      .status(200)
      .json({ message: 'All vehicles have been found', data: vehicles });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOneOrFail(
      Vehicle,
      { id },
      {
        populate: [
          'location',
          'color',
          'vehicleModel',
          'vehicleModel.category',
          'vehicleModel.brand',
          'reservations',
          'reservations.client',
        ],
      }
    );
    if (!vehicle) {
      res.status(404).json({ message: 'The vehicle does not exist' });
    }
    else {
      res.status(200).json({ message: 'The vehicle has been found', data: vehicle });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const vehicle = em.create(Vehicle, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The vehicle has been created', data: vehicle });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOne(Vehicle, { id });
    if (!vehicle) { 
      res.status(404).json({ message: 'The vehicle does not exist' });
    }
    else {
      em.assign(vehicle, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The vehicle has been updated', data: vehicle });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOne(Vehicle, { id });
    const vehicleInUse = await em.findOne( Reservation, { vehicle: id }); //TODO: Deberia poder ponerse a los vehiculos en baja independientemente si estan en una reserva
    if (!vehicle) {
      res.status(404).json({ message: 'The vehicle does not exist' });
    } 
    else if (vehicleInUse) {
      res.status(400).json({ message: 'The vehicle is in use' });
    }
    else {
      const vehicleReference = em.getReference(Vehicle, id); //TODO: Problablemente no haga falta obtener las referencias, se podría usar vehicle tal cual
      await em.removeAndFlush(vehicleReference);
      res.status(200).json({ message: 'The vehicle has been deleted' });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export { sanitizedVehicleInput, findAll, findOne, add, update, remove };
