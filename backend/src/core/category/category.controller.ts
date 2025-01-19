// Express
import { Request, Response } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { Category } from './category.entity.js';
import { VehicleModel } from '../vehicle-model/vehicle-model.entity.js';

const em = orm.em;

const findAll = async (_req: Request, res: Response) => {
  try {
    const categories = await em.find(Category, {});
    res
      .status(200)
      .json({ message: 'All categories have been found', data: categories });
  } catch (error) {
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
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Category, req.body.sanitizedInput);
    await em.flush();
    res.status(201).end();
  } catch (error) {
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
  } catch (error) {
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
      res.status(400).json({
        message:
          'La categoría no se puede eliminar porque tiene modelos asociados.',
      });
    } else {
      await em.removeAndFlush(category);
      res.status(200).json({ message: 'The category has been deleted' });
    }
  } catch (error) {
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
  } catch (error) {
    res.status(200).json({ exists: false });
  }
};

export { findAll, findOne, add, update, remove, verifyCategoryNameExists };
