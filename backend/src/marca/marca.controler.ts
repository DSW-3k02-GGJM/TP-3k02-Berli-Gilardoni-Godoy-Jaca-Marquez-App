import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Brand } from './marca.entity.js';

const em = orm.em;

const sanitizedBrandInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Creación del objeto `sanitizedInput` en `req.body`
  req.body.sanitizedInput = {
    brandName: req.body.brandName,
    vehicleModels: req.body.vehicleModels,
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
    const brands = await em.find(
      Brand,
      {},
      {
        populate: [
          'vehicleModels',
          'vehicleModels.category',
          'vehicleModels.vehicles',
          'vehicleModels.vehicles.color',
          'vehicleModels.vehicles.location',
          'vehicleModels.vehicles.reservations',
          'vehicleModels.vehicles.reservations.client',
        ],
      }
    );
    res
      .status(200)
      .json({ message: 'All brands have been found', data: brands });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const brand = await em.findOneOrFail(
      Brand,
      { id },
      {
        populate: [
          'vehicleModels',
          'vehicleModels.category',
          'vehicleModels.vehicles',
          'vehicleModels.vehicles.color',
          'vehicleModels.vehicles.location',
          'vehicleModels.vehicles.reservations',
          'vehicleModels.vehicles.reservations.client',
        ],
      }
    );
    res.status(200).json({ message: 'The brand has been found', data: brand });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const brand = em.create(Brand, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The brand has been created', data: brand });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const brand = em.getReference(Brand, id);
    em.assign(brand, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'The brand has been updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const brand = em.getReference(Brand, id);
    await em.removeAndFlush(brand);
    res.status(200).send({ message: 'The brand has been deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { sanitizedBrandInput, findAll, findOne, add, update, remove };
