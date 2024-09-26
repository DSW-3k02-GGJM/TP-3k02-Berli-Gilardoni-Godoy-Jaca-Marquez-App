import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Vehicle } from './vehicle.entity.js';
import { Location } from '../location/location.entity.js';


const em = orm.em;

const sanitizedVehicleInput = (
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
  next();
};

const sanitizedFilterInput = async (
    req: Request,
    res: Response,
    next: NextFunction,
    ) => {
      req.query.sanitizedInput = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        location: req.query.location,
      };

  const {startDate, endDate, location} = req.query.sanitizedInput;
  console.log('Received startDate:', startDate, 'Type:', typeof startDate);
  console.log('parsed as: ', new Date(startDate as string));
  console.log('Received endDate:', endDate, 'Type:', typeof endDate);
  console.log('parsed as: ', new Date(endDate as string));
  console.log('Received location:', location, 'Type:', typeof location);

  if (!isValidDateFormat(startDate as string)) {
    return res.status(400).json({message: 'Invalid or missing startDate'});
  } else {
    if (Date.parse(startDate as string) < Date.now()) {
      return res.status(400).json({message: "Invalid startDate. You can't book a reservation for the past!"});
    }}

  if (!isValidDateFormat(endDate as string)) {
    return res.status(400).json({message: 'Invalid or missing endDate'});
  } else {
    if (Date.parse(startDate as string) > Date.parse(endDate as string)) {
      return res.status(400).json({message: "Invalid endDate. You reservation can't end if it never started!"});
    }}

  if (!Number.isInteger(Number(location)) || Number(location) < 1 || Number(location) > await em.count(Location)) {
    return res.status(400).json({message: 'Invalid or missing location'});
  }

  next();
  }

function isValidDateFormat(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
  if (!regex.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 && // JavaScript months are 0-indexed
      date.getDate() === day
  );
}

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
          .json({message: 'All vehicles have been found', data: vehicles});
    } catch (error: any) {
      res.status(500).json({message: error.message});
    }
  };

  const findOne = async (req: Request, res: Response) => {
    console.log('findOne called');
    try {
      const id = Number.parseInt(req.params.id);
      console.log('Received ID:', req.params.id); // Log the received ID
      if (isNaN(id)) {
        return res.status(400).json({message: 'Invalid ID format'});
      }
      const vehicle = await em.findOneOrFail(
          Vehicle,
          {id},
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
      res.status(200).json({message: 'The vehicle has been found', data: vehicle});
    } catch (error: any) {
      res.status(500).json({message: error.message});
    }
  };

  const add = async (req: Request, res: Response) => {
    try {
      const vehicle = em.create(Vehicle, req.body.sanitizedInput);
      await em.flush();
      res.status(201).json({message: 'The vehicle has been created', data: vehicle});
    } catch (error: any) {
      res.status(500).json({message: error.message});
    }
  };

  const update = async (req: Request, res: Response) => {
    try {
      const id = Number.parseInt(req.params.id);
      const vehicle = await em.findOneOrFail(Vehicle, {id});
      em.assign(vehicle, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({message: 'The vehicle has been updated', data: vehicle});
    } catch (error: any) {
      res.status(500).json({message: error.message});
    }
  };

  const remove = async (req: Request, res: Response) => {
    try {
      const id = Number.parseInt(req.params.id);
      const vehicle = em.getReference(Vehicle, id);
      await em.removeAndFlush(vehicle);
      res.status(200).send({message: 'The vehicle has been deleted'});
    } catch (error: any) {
      res.status(500).json({message: error.message});
    }
  };

  export const findAvailable = async (req: Request, res: Response) => {
    try {
      const filter: any = req.query.sanitizedInput;
      const filters: any = {};

      filters.$and = [];
      filters.$and.push({'l1.id': filter.location});

      const reservationFilters: any[] = [];

      reservationFilters.push({'r6.startDate': {$eq: null}});
      reservationFilters.push({'r6.startDate': {$gte: new Date(filter.endDate as string)}});
      reservationFilters.push({'r6.planned_end_date': {$lte: new Date(filter.startDate as string)}});
      reservationFilters.push({'r6.cancellation_date': {$ne: null}});
      filters.$and.push({$or: reservationFilters});

      const vehicles = await em.find(
          Vehicle,
          filters,
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
      res.status(200).json({message: 'All vehicles have been found', data: vehicles});

    } catch (error: any) {
      res.status(500).json({message: error.message});
    }
  };

  export {sanitizedVehicleInput, sanitizedFilterInput, findAll, findOne, add, update, remove};

