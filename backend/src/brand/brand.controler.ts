import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Brand } from './brand.entity.js';
import { VehicleModel } from '../vehicleModel/vehicleModel.entity.js';

const em = orm.em;

const sanitizedBrandInput = async (
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

  const id = Number.parseInt(req.params.id);
  const brandName = req.body.sanitizedInput.brandName;

  if(!brandName) {
    return res.status(400).json({ message: 'All information is required' });
  }

  const brandB = await em.findOne( Brand , { brandName } , {populate: [] , });
  if (brandB) {
    if (brandB.id !== id) {
      return res.status(400).json({ message: 'This name is already used' });
    }
  }
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
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const brand = await em.findOne(
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
    if (!brand) {
      res.status(404).json({ message: 'The brand does not exist' });
    } 
    else {
      res.status(200).json({ message: 'The brand has been found', data: brand });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const brand = em.create(Brand, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The brand has been created', data: brand });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const brand = await em.findOne(Brand, { id });
    if (!brand) {
      res.status(404).json({ message: 'The brand does not exist' });
    }
    else {
      const brandRefence = em.getReference(Brand, id);
      em.assign(brandRefence, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The brand has been updated' });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const brand = await em.findOne(Brand, { id });
    const brandInUse = await em.findOne( VehicleModel, { brand: id });
    if (!brand) {
      res.status(404).json({ message: 'The brand does not exist' });
    } 
    else if( brandInUse ) {
      res.status(400).json({ message: 'The brand is in use' });
    }
    else {
      const brandRefence = em.getReference(Brand, id);
      await em.removeAndFlush(brandRefence);
      res.status(200).send({ message: 'The brand has been deleted' });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export { sanitizedBrandInput, findAll, findOne, add, update, remove };
