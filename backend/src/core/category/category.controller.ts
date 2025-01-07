// Express
import { Request, Response, NextFunction } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { Category } from './category.entity.js';
import { VehicleModel } from '../vehicle-model/vehicle-model.entity.js';

const em = orm.em;

const sanitizedCategoryInput = async (
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

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const id = Number.parseInt(req.params.id);
  const categoryName = req.body.sanitizedInput.categoryName;
  const categoryDescription = req.body.sanitizedInput.categoryDescription;
  const pricePerDay = req.body.sanitizedInput.pricePerDay;
  const depositValue = req.body.sanitizedInput.depositValue;

  if (!categoryName || !categoryDescription || !pricePerDay || !depositValue) {
    return res.status(400).json({ message: 'All information is required' });
  }

  if (pricePerDay < 0 || depositValue < 0) {
    return res.status(400).json({
      message: 'Price per day and deposit value must be greater than 0',
    });
  }

  const category = await em.findOne(Category, { categoryName });
  if (category) {
    if (category.id !== id) {
      return res.status(400).json({ message: 'This name is already used' });
    }
  }

  next();
};

const findAll = async (req: Request, res: Response) => {
  try {
    const categories = await em.find(Category, {});
    res
      .status(200)
      .json({ message: 'All categories have been found', data: categories });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const category = await em.findOne(Category, { id });
    if (!category) {
      res.status(404).json({ message: 'The category does not exist' });
    } else {
      res
        .status(200)
        .json({ message: 'The category has been found', data: category });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Category, req.body.sanitizedInput);
    await em.flush();
    res.status(201).end();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const category = await em.findOne(Category, { id });
    if (!category) {
      res.status(404).json({ message: 'The category does not exist' });
    } else {
      em.assign(category, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The category has been updated' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const category = await em.findOne(Category, { id });
    const categoryInUse = await em.findOne(VehicleModel, { category: id });
    if (!category) {
      res.status(404).json({ message: 'The category does not exist' });
    } else if (categoryInUse) {
      res.status(400).json({ message: 'The category is in use' });
    } else {
      await em.removeAndFlush(category);
      res.status(200).send({ message: 'The category has been deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyCategoryNameExists = async (req: Request, res: Response) => {
  try {
    const categoryName = req.params.categoryName;
    const id = Number.parseInt(req.params.id);
    const category = await em.findOneOrFail(Category, { categoryName });
    if (category.id === id) {
      res.status(200).json({ exists: false });
    } else {
      res.status(200).json({ exists: true });
    }
  } catch (error: any) {
    res.status(200).json({ exists: false });
  }
};

export {
  sanitizedCategoryInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyCategoryNameExists,
};
