import {NextFunction, Request, Response} from 'express';
import { orm } from '../shared/db/orm.js';
import { Color } from './color.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

const em = orm.em;

const sanitizedColorInput = async (
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

  const id = Number.parseInt(req.params.id);
  const colorName = req.body.sanitizedInput.colorName;

  if (!colorName) {
    return res.status(400).json({ message: 'All information is required' });
  }

  const colorC = await em.findOne( Color , { colorName } , {populate: [] , });
  if(colorC){
    if (colorC.id !== id) {
      return res.status(400).json({ message: 'This name is already used' });
    }
  }
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
          'vehicles.reservations.user',
        ],
      }
    );
    res.status(200).json({
      message: 'All colors have been found',
      data: colors,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = await em.findOne(
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
          'vehicles.reservations.user',
        ],
      }
    );
    if (!color) {
      return res.status(404).json({ message: 'The color does not exist' });
    }
    else {
      res.status(200).json({
        message: 'The color has been found',
        data: color,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const color = em.create(Color, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The color has been created', data: color });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = await em.findOne(Color, { id });
    if (!color) {
      return res.status(404).json({ message: 'The color does not exist' });
    }
    else {
      const colorReference = em.getReference(Color, id);
      em.assign(color, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The color has been updated' });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = await em.findOne(Color, { id });
    const colorInUse = await em.findOne( Vehicle, { color: id });
    if (!color) {
      return res.status(404).json({ message: 'The color does not exist' });
    }
    else if (colorInUse) {
      return res.status(400).json({ message: 'The color is in use' });
    }
    else {
      const colorReference = em.getReference(Color, id);
      await em.removeAndFlush(colorReference);
      res.status(200).send({ message: 'The color has been deleted' });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const verifColorNameExists = async (req: Request, res: Response) => {
  try {
    const colorName = req.params.colorName;
    const id = Number.parseInt(req.params.id);
    const color = await em.findOneOrFail(
      Color,
      { colorName: colorName });
    if (color.id === id) {
      res.status(200).json({ exists: false });
    }
    else {
      res.status(200).json({ exists: true });
    }
  }
  catch (error: any) {
    res.status(200).json({ exists: false});
  }
};

export { sanitizedColorInput, findAll, findOne, add, update, remove, verifColorNameExists};
