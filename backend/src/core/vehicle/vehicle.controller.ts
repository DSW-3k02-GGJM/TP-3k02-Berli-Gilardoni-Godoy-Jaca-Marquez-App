// Express
import { Request, Response } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { Vehicle } from './vehicle.entity.js';
import { Reservation } from '../reservation/reservation.entity.js';

const em = orm.em;

const findAll = async (_req: Request, res: Response) => {
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
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Vehicle, req.body.sanitizedInput);
    await em.flush();
    res.status(201).end();
  } catch (error) {
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
  } catch (error) {
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
      res.status(400).json({
        message:
          'El vehículo no se puede eliminar porque tiene reservas asociadas.',
      });
    } else {
      await em.removeAndFlush(vehicle);
      res.status(200).json({ message: 'The vehicle has been deleted' });
    }
  } catch (error) {
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
  } catch (error) {
    res.status(200).json({ exists: false });
  }
};

const findAvailable = async (req: Request, res: Response) => {
  try {
    // Get the filter, which includes: StartDate, EndDate and Location
    const filter = req.body.sanitizedInput as {
      startDate: string;
      endDate: string;
      location: string;
    };

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
    const vehicleFilter: {} = {
      $and: [
        { 'l1.id': filter.location },
        { id: { $nin: reservations.map((res) => res.vehicle.id) } },
      ],
    };

    // Find the vehicles that meet the previous filter (vehicleFilters)
    const vehicles = await em.find(Vehicle, vehicleFilter, {
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
  } catch (error) {
    // If something fails, return a response code indicating an error,
    // along with a descriptive error message
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyLicensePlateExists,
  findAvailable,
};
