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
    res.status(200).json({
      message: 'Todas las categorías han sido encontradas',
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const category = await em.findOne(Category, { id });
    if (!category) {
      res.status(404).json({ message: 'Categoría no encontrada' });
    } else {
      res
        .status(200)
        .json({ message: 'La categoría ha sido encontrada', data: category });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Category, req.body.sanitizedInput);
    await em.flush();
    res
      .status(201)
      .json({ message: 'La categoría ha sido registrada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const category = await em.findOne(Category, { id });
    if (!category) {
      res.status(404).json({ message: 'Categoría no encontrada' });
    } else {
      em.assign(category, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: 'La categoría ha sido actualizada exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const category = await em.findOne(Category, { id });
    const categoryInUse = await em.findOne(VehicleModel, { category: id });
    if (!category) {
      res.status(404).json({ message: 'Categoría no encontrada' });
    } else if (categoryInUse) {
      res.status(400).json({
        message:
          'La categoría no se puede eliminar porque tiene modelos asociados.',
      });
    } else {
      await em.removeAndFlush(category);
      res
        .status(200)
        .json({ message: 'La categoría ha sido eliminada exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const verifyCategoryNameExists = async (req: Request, res: Response) => {
  try {
    const categoryName = req.params.categoryName.trim();
    const id = Number.parseInt(req.params.id);
    const category = await em.findOneOrFail(Category, { categoryName });
    res.status(200).json({ exists: category.id !== id });
  } catch (error) {
    res.status(200).json({ exists: false });
  }
};

export { findAll, findOne, add, update, remove, verifyCategoryNameExists };
