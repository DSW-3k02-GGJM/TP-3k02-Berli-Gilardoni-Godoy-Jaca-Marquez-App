// Express
import { Request, Response } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { Brand } from './brand.entity.js';
import { VehicleModel } from '../vehicle-model/vehicle-model.entity.js';

const em = orm.em;

const findAll = async (_req: Request, res: Response) => {
  try {
    const brands = await em.find(Brand, {});
    res
      .status(200)
      .json({ message: 'Todas las marcas han sido encontradas', data: brands });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const brand = await em.findOne(Brand, { id });
    if (!brand) {
      res.status(404).json({ message: 'Marca no encontrada' });
    } else {
      res
        .status(200)
        .json({ message: 'La marca ha sido encontrada', data: brand });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Brand, req.body.sanitizedInput);
    await em.flush();
    res
      .status(201)
      .json({ message: 'La marca ha sido registrada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const brand = await em.findOne(Brand, { id });
    if (!brand) {
      res.status(404).json({ message: 'Marca no encontrada' });
    } else {
      em.assign(brand, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({
        message: 'La marca ha sido actualizada exitosamente',
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const brand = await em.findOne(Brand, { id });
    const brandInUse = await em.findOne(VehicleModel, { brand: id });
    if (!brand) {
      res.status(404).json({ message: 'Marca no encontrada' });
    } else if (brandInUse) {
      res.status(400).json({
        message:
          'La marca no se puede eliminar porque tiene modelos asociados.',
      });
    } else {
      await em.removeAndFlush(brand);
      res
        .status(200)
        .json({ message: 'La marca ha sido eliminada exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const verifyBrandNameExists = async (req: Request, res: Response) => {
  try {
    const brandName = req.params.brandName.trim();
    const id = Number.parseInt(req.params.id);
    const brand = await em.findOneOrFail(Brand, { brandName });
    if (brand.id === id) {
      res.status(200).json({ exists: false });
    } else {
      res.status(200).json({ exists: true });
    }
  } catch (error) {
    res.status(200).json({ exists: false });
  }
};

export { findAll, findOne, add, update, remove, verifyBrandNameExists };
