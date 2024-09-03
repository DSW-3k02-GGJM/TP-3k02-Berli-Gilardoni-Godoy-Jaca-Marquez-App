import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { VehicleModel } from './vehicleModel.entity.js';

const em = orm.em;

//TODO: sanitizeInput

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
    const vehicleModel = em.create(VehicleModel, req.body);
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
    em.assign(vehicleModel, req.body);
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

export { findAll, findOne, add, update, remove };
