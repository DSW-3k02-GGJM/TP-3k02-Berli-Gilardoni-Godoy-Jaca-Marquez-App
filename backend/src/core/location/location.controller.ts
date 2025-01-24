// Express
import { Request, Response } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { Location } from './location.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

const em = orm.em;

const findAll = async (_req: Request, res: Response) => {
  try {
    const locations = await em.find(Location, {});
    res.status(200).json({
      message: 'Todas las sucursales han sido encontradas',
      data: locations,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const location = await em.findOne(Location, { id });
    if (!location) {
      res.status(404).json({ message: 'Sucursal no encontrada' });
    } else {
      res
        .status(200)
        .json({ message: 'La sucursal ha sido encontrada', data: location });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Location, req.body.sanitizedInput);
    await em.flush();
    res
      .status(201)
      .json({ message: 'La sucursal ha sido registrada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const location = await em.findOne(Location, { id });
    if (!location) {
      return res.status(404).json({ message: 'Sucursal no encontrada' });
    } else {
      em.assign(location, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: 'La sucursal ha sido actualizada exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const location = await em.findOne(Location, { id });
    const locationInUse = await em.findOne(Vehicle, { location: id });
    if (!location) {
      return res.status(404).json({ message: 'Sucursal no encontrada' });
    } else if (locationInUse) {
      return res.status(400).json({
        message:
          'La sucursal no se puede eliminar porque tiene vehiculos asociados.',
      });
    } else {
      await em.removeAndFlush(location);
      res
        .status(200)
        .json({ message: 'La sucursal ha sido eliminada exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const verifyLocationNameExists = async (req: Request, res: Response) => {
  try {
    const locationName = req.params.locationName.trim();
    const id = Number.parseInt(req.params.id);
    const location = await em.findOneOrFail(Location, { locationName });
    if (location.id === id) {
      res.status(200).json({ exists: false });
    } else {
      res.status(200).json({ exists: true });
    }
  } catch (error) {
    res.status(200).json({ exists: false });
  }
};

export { findAll, findOne, add, update, remove, verifyLocationNameExists };
