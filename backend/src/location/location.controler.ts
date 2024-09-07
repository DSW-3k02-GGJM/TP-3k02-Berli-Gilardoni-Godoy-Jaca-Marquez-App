import {NextFunction, Request, Response} from 'express';
import { orm } from '../shared/db/orm.js';
import { Location } from './location.entity.js';

const em = orm.em;

const sanitizedLocationInput = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  // 1. Creación del objeto `sanitizedInput` en `req.body`
  req.body.sanitizedInput = {
    locationName: req.body.locationName,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    vehicles: req.body.vehicles,
  };
  // 2. Eliminación de claves indefinidas en `sanitizedInput`
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  // 3. Llamada al siguiente middleware o controlador
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
          'vehicles.reservations.client',
        ],
      }
    );
    res.status(200).json({
      message: 'All locations have been found',
      data: locations,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const location = await em.findOneOrFail(
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
          'vehicles.reservations.client',
        ],
      }
    );
    res.status(200).json({
      message: 'The location has been found',
      data: location,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const location = em.create(Location, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The locations has been created', data: location });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const location = em.getReference(Location, id);
    em.assign(location, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'The location has been updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const location = em.getReference(Location, id);
    await em.removeAndFlush(location);
    res.status(200).send({ message: 'The location has been deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { sanitizedLocationInput, findAll, findOne, add, update, remove };
