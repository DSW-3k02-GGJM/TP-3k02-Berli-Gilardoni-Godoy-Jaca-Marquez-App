// Express
import { Request, Response, NextFunction } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { VehicleModel } from './vehicle-model.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

const em = orm.em;

const sanitizedVehicleModelInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    vehicleModelName: req.body.vehicleModelName,
    transmissionType: req.body.transmissionType,
    passengerCount: req.body.passengerCount,
    imagePath: req.body.imagePath,
    category: req.body.category,
    brand: req.body.brand,
    vehicles: req.body.vehicles,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const id = Number.parseInt(req.params.id);

  const {
    vehicleModelName,
    transmissionType,
    passengerCount,
    imagePath,
    category,
    brand,
  } = req.body.sanitizedInput;

  if (
    !vehicleModelName ||
    !transmissionType ||
    !imagePath ||
    !category ||
    !brand
  ) {
    return res.status(400).json({ message: 'All information is required' });
  }

  if (passengerCount < 0) {
    return res
      .status(400)
      .json({ message: 'Passenger count must be greater than 0' });
  }

  const vehicleModel = await em.findOne(VehicleModel, { vehicleModelName });
  if (vehicleModel && vehicleModel.id !== id) {
    return res.status(400).json({ message: 'This name is already used' });
  }

  next();
};

const findAll = async (req: Request, res: Response) => {
  try {
    const vehicleModels = await em.find(
      VehicleModel,
      {},
      {
        populate: ['brand', 'category'],
      }
    );
    res.status(200).json({
      message: 'All vehicle models have been found',
      data: vehicleModels,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicleModel = await em.findOne(
      VehicleModel,
      { id },
      {
        populate: ['brand', 'category'],
      }
    );
    if (!vehicleModel) {
      res.status(404).json({ message: 'The vehicle model does not exist' });
    } else {
      res.status(200).json({
        message: 'The vehicle model has been found',
        data: vehicleModel,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(VehicleModel, req.body.sanitizedInput);
    await em.flush();
    res.status(201).end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicleModel = await em.findOne(VehicleModel, { id });
    if (!vehicleModel) {
      res.status(404).json({ message: 'The vehicle model does not exist' });
    } else {
      em.assign(vehicleModel, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The vehicle model has been updated' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicleModel = await em.findOne(VehicleModel, { id });
    const vehicleModelInUse = await em.findOne(Vehicle, { vehicleModel: id });
    if (!vehicleModel) {
      res.status(404).json({ message: 'The vehicle model does not exist' });
    } else if (vehicleModelInUse) {
      res.status(400).json({ message: 'The vehicle model is in use' });
    } else {
      await em.removeAndFlush(vehicleModel);
      res.status(200).json({
        message: 'The vehicle model has been deleted',
        imagePath: vehicleModel.imagePath,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyVehicleModelNameExists = async (req: Request, res: Response) => {
  try {
    const vehicleModelName = req.params.vehicleModelName;
    const id = Number.parseInt(req.params.id);
    const vehicleModel = await em.findOneOrFail(VehicleModel, {
      vehicleModelName,
    });
    if (vehicleModel.id === id) {
      res.status(200).json({ exists: false });
    } else {
      res.status(200).json({ exists: true });
    }
  } catch (error) {
    res.status(200).json({ exists: false });
  }
};

export {
  sanitizedVehicleModelInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyVehicleModelNameExists,
};
