import {NextFunction, Request, Response} from 'express';
import { orm } from '../shared/db/orm.js';
import { VehicleModel } from './vehicleModel.entity.js';

const em = orm.em;

const sanitizedVehicleModelInput = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  // 1. Creación del objeto `sanitizedInput` en `req.body`
  req.body.sanitizedInput = {
    vehicleModelName: req.body.vehicleModelName,
    transmissionType: req.body.transmissionType,
    passengerCount: req.body.passengerCount,
    imagePath: req.body.imagePath,
    category: req.body.category,
    brand: req.body.brand,
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
    const vehicleModels = await em.find(
      VehicleModel,
      {},
      {
        populate: [
          'category',
          'brand',
          'vehicles',
          'vehicles.location',
          'vehicles.color',
          'vehicles.reservations',
          'vehicles.reservations.client',
        ],
      }
    );
    res.status(200).json({
      message: 'All vehicle models have been found',
      data: vehicleModels,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const modelo = await em.findOneOrFail(
      VehicleModel,
      { id },
      {
        populate: [
          'category',
          'brand',
          'vehicles',
          'vehicles.location',
          'vehicles.color',
          'vehicles.reservations',
          'vehicles.reservations.client',
        ],
      }
    );
    res.status(200).json({
      message: 'The vehicle model has been found',
      data: modelo,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const vehicleModel = em.create(VehicleModel, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The vehicle model has been created', data: vehicleModel });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicleModel = await em.findOneOrFail(VehicleModel, { id });
    em.assign(vehicleModel, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'The vehicle model has been updated', data: vehicleModel });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicleModel = em.getReference(VehicleModel, id);
    await em.removeAndFlush(vehicleModel);
    res.status(200).send({ message: 'The vehicle model has been deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { sanitizedVehicleModelInput, findAll, findOne, add, update, remove };
