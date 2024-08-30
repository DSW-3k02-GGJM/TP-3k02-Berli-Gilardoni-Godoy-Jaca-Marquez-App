import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Category } from './categoria.entity.js';

const em = orm.em;

const sanitizedCategoryInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    categoryName: req.body.categoryName,
    categoryDescription: req.body.categoryDescription,
    pricePerDay: req.body.pricePerDay,
    depositValue: req.body.depositValue,
    vehicleModels: req.body.vehicleModels,
  };
  // Más validaciones
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
};

const findAll = async (req: Request, res: Response) => {
  try {
    const categories = await em.find(
      Category,
      {},
      {
        populate: [
          'vehicleModels',
          'vehicleModels.brand',
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
      .json({ message: 'All categories have been found', data: categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const category = await em.findOneOrFail(
      Category,
      {},
      {
        populate: [
          'vehicleModels',
          'vehicleModels.brand',
          'vehicleModels.vehicles',
          'vehicleModels.vehicles.color',
          'vehicleModels.vehicles.location',
          'vehicleModels.vehicles.reservations',
          'vehicleModels.vehicles.reservations.client',
        ],
      }
    );
    res.status(200).json({ message: 'The category has been found', data: category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const category = em.create(Category, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The category has been created', data: category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const category = await em.findOneOrFail(Category, { id });
    em.assign(category, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'The category has been updated', data: category });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const category = em.getReference(Category, id);
    await em.removeAndFlush(category);
    res.status(200).send({ message: 'The category has been deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { sanitizedCategoryInput, findAll, findOne, add, update, remove };
