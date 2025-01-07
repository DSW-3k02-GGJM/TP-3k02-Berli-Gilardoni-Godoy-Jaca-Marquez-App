// Express
import { Request, Response, NextFunction } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { Vehicle } from './vehicle.entity.js';
import { Reservation } from '../reservation/reservation.entity.js';
import { Location } from '../location/location.entity.js';

// External Libraries
import moment from 'moment';

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

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const id = Number.parseInt(req.params.id);

  const {
    licensePlate,
    manufacturingYear,
    totalKms,
    location,
    color,
    vehicleModel,
  } = req.body.sanitizedInput;

  if (
    !licensePlate ||
    !manufacturingYear ||
    !location ||
    !color ||
    !vehicleModel
  ) {
    return res.status(400).json({ message: 'All information is required' });
  }

  if (totalKms < 0) {
    return res
      .status(400)
      .json({ message: 'Total kms must be greater than 0' });
  }

  const vehicle = await em.findOne(Vehicle, { licensePlate });
  if (vehicle && vehicle.id !== id) {
    return res
      .status(400)
      .json({ message: 'This license plate is already used' });
  }

  next();
};

const sanitizedFilterInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.sanitizedInput = {
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    location: req.query.location,
  };

  const { startDate, endDate, location } = req.query.sanitizedInput;

  if (!isValidDateFormat(startDate as string)) {
    return res.status(400).json({ message: 'Invalid or missing startDate' });
  } else if (moment(startDate as string).isBefore(moment().startOf('day'))) {
    return res.status(400).json({
      message: "Invalid startDate. You can't book a reservation for the past!",
    });
  }

  if (!isValidDateFormat(endDate as string)) {
    return res.status(400).json({ message: 'Invalid or missing endDate' });
  } else if (moment(startDate as string).isAfter(moment(endDate as string))) {
    return res.status(400).json({
      message:
        "Invalid endDate. Your reservation can't end if it never started!",
    });
  }

  if (Number.isInteger(Number(location)) && !(Number(location) < 1)) {
    try {
      const storedLocation = await em.findOne(Location, {
        id: Number(location),
      });

      if (!storedLocation) {
        return res.status(400).json({ message: 'Invalid or missing location' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(400).json({ message: 'Invalid or missing location' });
  }

  next();
};

function isValidDateFormat(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

const findAll = async (req: Request, res: Response) => {
  try {
    const vehicles = await em.find(
      Vehicle,
      {},
      {
        populate: ['color', 'location', 'vehicleModel.brand'],
      }
    );
    res
      .status(200)
      .json({ message: 'All vehicles have been found', data: vehicles });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOne(
      Vehicle,
      { id },
      {
        populate: ['color', 'location', 'vehicleModel.brand'],
      }
    );
    if (!vehicle) {
      res.status(404).json({ message: 'The vehicle does not exist' });
    } else {
      res
        .status(200)
        .json({ message: 'The vehicle has been found', data: vehicle });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Vehicle, req.body.sanitizedInput);
    await em.flush();
    res.status(201).end();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOne(Vehicle, { id });
    if (!vehicle) {
      res.status(404).json({ message: 'The vehicle does not exist' });
    } else {
      em.assign(vehicle, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The vehicle has been updated' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOne(Vehicle, { id });
    const vehicleInUse = await em.findOne(Reservation, { vehicle: id });
    if (!vehicle) {
      res.status(404).json({ message: 'The vehicle does not exist' });
    } else if (vehicleInUse) {
      res.status(400).json({ message: 'The vehicle is in use' });
    } else {
      await em.removeAndFlush(vehicle);
      res.status(200).json({ message: 'The vehicle has been deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyLicensePlateExists = async (req: Request, res: Response) => {
  try {
    const licensePlate = req.params.licensePlate;
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOneOrFail(Vehicle, { licensePlate });
    if (vehicle.id === id) {
      res.status(200).json({ exists: false });
    } else {
      res.status(200).json({ exists: true });
    }
  } catch (error: any) {
    res.status(200).json({ exists: false });
  }
};

const findAvailable = async (req: Request, res: Response) => {
  try {
    // Get the filter from the request, which includes:
    // StartDate, EndDate  and Location
    const filter: any = req.query.sanitizedInput;

    // Find active reservations that overlap with the
    // date range indicated in the request filter
    const reservations = await em.find(Reservation, {
      $and: [
        { realEndDate: null },
        { cancellationDate: null },
        { startDate: { $lte: filter.endDate } },
        { plannedEndDate: { $gte: filter.startDate } },
      ],
    });

    // Build a filter for vehicles, searching for those
    // that are from the location specified in the request filter,
    // and whose ids do not match any id of the vehicles associated
    // with the active reservations that overlap the dates
    // (reservations obtained in the previous query)
    const vehicleFilters: any[] = [
      {
        $and: [
          { 'l1.id': filter.location },
          { id: { $nin: reservations.map((res) => res.vehicle.id) } },
        ],
      },
    ];

    // Find the vehicles that meet the previous filter (vehicleFilters)
    const vehicles = await em.find(Vehicle, vehicleFilters, {
      populate: ['location', 'vehicleModel.brand', 'vehicleModel.category'],
    });

    // Build a "Dictionary" where the key is the model name and the
    // value is an array of Vehicle objects of that model
    const vehiclesByModel: { [key: string]: Vehicle[] } = {};

    // Loop through the array of Vehicles and store them in the dictionary
    vehicles.forEach((vehicle) => {
      const modelName = vehicle.vehicleModel.vehicleModelName;
      if (!vehiclesByModel[modelName]) {
        vehiclesByModel[modelName] = [];
      }
      vehiclesByModel[modelName].push(vehicle);
    });

    // Build the final response as an array, where for each
    // model, the first available vehicle is returned
    const responseData = Object.keys(vehiclesByModel).map(
      (modelName) => vehiclesByModel[modelName][0]
    );

    // Return an OK response code with the information from responseData
    res.status(200).json({
      message: 'All vehicles have been found',
      data: responseData,
    });
  } catch (error: any) {
    // If something fails, return a response code indicating an error,
    // along with a descriptive error message
    res.status(500).json({ message: error.message });
  }
};

export {
  sanitizedVehicleInput,
  sanitizedFilterInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyLicensePlateExists,
  findAvailable,
};
