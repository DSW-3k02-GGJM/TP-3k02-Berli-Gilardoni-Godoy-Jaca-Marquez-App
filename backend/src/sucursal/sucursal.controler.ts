import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { Location } from './sucursal.entity.js';

const em = orm.em;

//TODO: elsanitizedinput

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
    const location = em.create(Location, req.body);
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
    em.assign(location, req.body);
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

export { findAll, findOne, add, update, remove };
