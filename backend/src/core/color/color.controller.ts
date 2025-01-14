// Express
import { Request, Response, NextFunction } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { Color } from './color.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

const em = orm.em;

const sanitizedColorInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    colorName: req.body.colorName,
    vehicles: req.body.vehicles,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const id = Number.parseInt(req.params.id);
  const colorName = req.body.sanitizedInput.colorName;

  if (!colorName) {
    return res.status(400).json({ message: 'All information is required' });
  }

  const color = await em.findOne(Color, { colorName });
  if (color) {
    if (color.id !== id) {
      return res.status(400).json({ message: 'This name is already used' });
    }
  }

  next();
};

const findAll = async (req: Request, res: Response) => {
  try {
    const colors = await em.find(Color, {});
    res
      .status(200)
      .json({ message: 'All colors have been found', data: colors });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = await em.findOne(Color, { id });
    if (!color) {
      return res.status(404).json({ message: 'The color does not exist' });
    } else {
      res
        .status(200)
        .json({ message: 'The color has been found', data: color });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Color, req.body.sanitizedInput);
    await em.flush();
    res.status(201).end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = await em.findOne(Color, { id });
    if (!color) {
      return res.status(404).json({ message: 'The color does not exist' });
    } else {
      em.assign(color, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The color has been updated' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = await em.findOne(Color, { id });
    const colorInUse = await em.findOne(Vehicle, { color: id });
    if (!color) {
      return res.status(404).json({ message: 'The color does not exist' });
    } else if (colorInUse) {
      return res.status(400).json({ message: 'The color is in use' });
    } else {
      await em.removeAndFlush(color);
      res.status(200).json({ message: 'The color has been deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyColorNameExists = async (req: Request, res: Response) => {
  try {
    const colorName = req.params.colorName;
    const id = Number.parseInt(req.params.id);
    const color = await em.findOneOrFail(Color, { colorName });
    if (color.id === id) {
      res.status(200).json({ exists: false });
    } else {
      res.status(200).json({ exists: true });
    }
  } catch (error) {
    res.status(200).json({ exists: false });
  }
};

export {
  sanitizedColorInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyColorNameExists,
};
