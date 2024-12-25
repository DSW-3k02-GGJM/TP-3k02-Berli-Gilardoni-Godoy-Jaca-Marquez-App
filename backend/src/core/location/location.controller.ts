// Express
import { Request, Response, NextFunction } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { Location } from './location.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

const em = orm.em;

const sanitizedLocationInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    locationName: req.body.locationName,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    vehicles: req.body.vehicles,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const id = Number.parseInt(req.params.id);
  const locationName = req.body.sanitizedInput.locationName;
  const address = req.body.sanitizedInput.address;
  const phoneNumber = req.body.sanitizedInput.phoneNumber;

  if (!locationName || !address || !phoneNumber) {
    return res.status(400).json({ message: 'All information is required' });
  }

  const location = await em.findOne(Location, { locationName });
  if (location) {
    if (location.id !== id) {
      return res.status(400).json({ message: 'This name is already used' });
    }
  }

  next();
};

const findAll = async (req: Request, res: Response) => {
  try {
    const locations = await em.find(
      Location,
      {},
      {
        populate: [
          'vehicles',
          'vehicles.color',
          'vehicles.vehicleModel',
          'vehicles.vehicleModel.category',
          'vehicles.vehicleModel.brand',
          'vehicles.reservations',
          'vehicles.reservations.user',
        ],
      }
    );
    res
      .status(200)
      .json({ message: 'All locations have been found', data: locations });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const location = await em.findOne(
      Location,
      { id },
      {
        populate: [
          'vehicles',
          'vehicles.color',
          'vehicles.vehicleModel',
          'vehicles.vehicleModel.category',
          'vehicles.vehicleModel.brand',
          'vehicles.reservations',
          'vehicles.reservations.user',
        ],
      }
    );
    if (!location) {
      res.status(404).json({ message: 'The location does not exist' });
    } else {
      res
        .status(200)
        .json({ message: 'The location has been found', data: location });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Location, req.body.sanitizedInput);
    await em.flush();
    res.status(201).end();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const location = await em.findOne(Location, { id });
    if (!location) {
      return res.status(404).json({ message: 'The location does not exist' });
    } else {
      em.assign(location, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The location has been updated' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const location = await em.findOne(Location, { id });
    const locationInUse = await em.findOne(Vehicle, { location: id });
    if (!location) {
      return res.status(404).json({ message: 'The location does not exist' });
    } else if (locationInUse) {
      return res.status(400).json({ message: 'The location is in use' });
    } else {
      await em.removeAndFlush(location);
      res.status(200).send({ message: 'The location has been deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyLocationNameExists = async (req: Request, res: Response) => {
  try {
    const locationName = req.params.locationName;
    const id = Number.parseInt(req.params.id);
    const location = await em.findOneOrFail(Location, { locationName });
    if (location.id === id) {
      res.status(200).json({ exists: false });
    } else {
      res.status(200).json({ exists: true });
    }
  } catch (error: any) {
    res.status(200).json({ exists: false });
  }
};

export {
  sanitizedLocationInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyLocationNameExists,
};
