// Express
import { Request, Response, NextFunction } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { Brand } from './brand.entity.js';
import { VehicleModel } from '../vehicle-model/vehicle-model.entity.js';

const em = orm.em;

const sanitizedBrandInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    brandName: req.body.brandName,
    vehicleModels: req.body.vehicleModels,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const id = Number.parseInt(req.params.id);
  const brandName = req.body.sanitizedInput.brandName;

  if (!brandName) {
    return res.status(400).json({ message: 'All information is required' });
  }

  const brand = await em.findOne(Brand, { brandName });
  if (brand) {
    if (brand.id !== id) {
      return res.status(400).json({ message: 'This name is already used' });
    }
  }

  next();
};

const findAll = async (req: Request, res: Response) => {
  try {
    const brands = await em.find(Brand, {});
    res
      .status(200)
      .json({ message: 'All brands have been found', data: brands });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const brand = await em.findOne(Brand, { id });
    if (!brand) {
      res.status(404).json({ message: 'The brand does not exist' });
    } else {
      res
        .status(200)
        .json({ message: 'The brand has been found', data: brand });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Brand, req.body.sanitizedInput);
    await em.flush();
    res.status(201).end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const brand = await em.findOne(Brand, { id });
    if (!brand) {
      res.status(404).json({ message: 'The brand does not exist' });
    } else {
      em.assign(brand, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The brand has been updated' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const brand = await em.findOne(Brand, { id });
    const brandInUse = await em.findOne(VehicleModel, { brand: id });
    if (!brand) {
      res.status(404).json({ message: 'The brand does not exist' });
    } else if (brandInUse) {
      res.status(400).json({ message: 'The brand is in use' });
    } else {
      await em.removeAndFlush(brand);
      res.status(200).json({ message: 'The brand has been deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyBrandNameExists = async (req: Request, res: Response) => {
  try {
    const brandName = req.params.brandName;
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

export {
  sanitizedBrandInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyBrandNameExists,
};
