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
    res.status(200).json({
      message: 'Todos los vehículos han sido encontrados',
      data: vehicles,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
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
      res.status(404).json({ message: 'Vehículo no encontrado' });
    } else {
      res
        .status(200)
        .json({ message: 'El vehículo ha sido encontrado', data: vehicle });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Vehicle, req.body.sanitizedInput);
    await em.flush();
    res
      .status(201)
      .json({ message: 'El vehículo ha sido registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOne(Vehicle, { id });
    if (!vehicle) {
      res.status(404).json({ message: 'Vehículo no encontrado' });
    } else {
      em.assign(vehicle, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: 'El vehículo ha sido actualizado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOne(Vehicle, { id });
    const vehicleInUse = await em.findOne(Reservation, { vehicle: id });
    if (!vehicle) {
      res.status(404).json({ message: 'Vehículo no encontrado' });
    } else if (vehicleInUse) {
      res.status(400).json({
        message:
          'El vehículo no se puede eliminar porque tiene reservas asociadas.',
      });
    } else {
      await em.removeAndFlush(vehicle);
      res
        .status(200)
        .json({ message: 'El vehículo ha sido eliminado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const verifyLicensePlateExists = async (req: Request, res: Response) => {
  try {
    const licensePlate = req.params.licensePlate.trim();
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOneOrFail(Vehicle, { licensePlate });
    res.status(200).json({ exists: vehicle.id !== id });
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

    // Extract unique and sorted vehicle IDs from the reservations
    const uniqueVehicleIds = Array.from(
      new Set(reservations.map((res) => res.vehicle.id))
    ).sort();

    // Build a filter for vehicles, searching for those
    // that are from the location specified in the request filter,
    // and whose ids do not match any id of the vehicles associated
    // with the active reservations that overlap the dates
    // (reservations obtained in the previous query)
    const vehicleFilter: {} = {
      $and: [{ 'l1.id': filter.location }, { id: { $nin: uniqueVehicleIds } }],
    };

    // Find the vehicles that meet the previous filter (vehicleFilter)
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
      message: 'Todos los vehículos disponibles han sido encontrados',
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
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
