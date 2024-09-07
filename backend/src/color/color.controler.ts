import {NextFunction, Request, Response} from 'express';
import { orm } from '../shared/db/orm.js';
import { Color } from './color.entity.js';

const em = orm.em;

const sanitizedColorInput = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  // 1. Creación del objeto `sanitizedInput` en `req.body`
  req.body.sanitizedInput = {
    colorName: req.body.colorName,
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
    const colors = await em.find(
      Color,
      {},
      {
        populate: [
          'vehicles',
          'vehicles.location',
          'vehicles.vehicleModel',
          'vehicles.vehicleModel.category',
          'vehicles.vehicleModel.brand',
          'vehicles.reservations',
          'vehicles.reservations.client',
        ],
      }
    );
    res.status(200).json({
      message: 'All colors have been found',
      data: colors,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = await em.findOneOrFail(
      Color,
      { id },
      {
        populate: [
          'vehicles',
          'vehicles.location',
          'vehicles.vehicleModel',
          'vehicles.vehicleModel.category',
          'vehicles.vehicleModel.brand',
          'vehicles.reservations',
          'vehicles.reservations.client',
        ],
      }
    );
    res.status(200).json({
      message: 'The color has been found',
      data: color,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const color = em.create(Color, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The color has been created', data: color });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = em.getReference(Color, id);
    em.assign(color, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'The color has been updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = em.getReference(Color, id);
    await em.removeAndFlush(color);
    res.status(200).send({ message: 'The color has been deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { sanitizedColorInput, findAll, findOne, add, update, remove };
