import {NextFunction, Request, Response} from 'express';
import { orm } from '../shared/db/orm.js';
import { Location } from './location.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

const em = orm.em;

const sanitizedLocationInput = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  // 1. Creación del objeto `sanitizedInput` en `req.body`
  req.body.sanitizedInput = {
    locationName: req.body.locationName,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    vehicles: req.body.vehicles,
  };
  // 2. Eliminación de claves indefinidas en `sanitizedInput`
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const id = Number.parseInt(req.params.id);
  const locationName = req.body.sanitizedInput.locationName;
  const address = req.body.sanitizedInput.address;
  const phoneNumber = req.body.sanitizedInput.phoneNumber;

  if (!locationName || !address || !phoneNumber) {
    return res.status(400).json({ message: 'All information is required' });
  }

  const locationL = await em.findOne( Location , { locationName } , {populate: [] , });
  if (locationL) {
    if (locationL.id !== id) {
      return res.status(400).json({ message: 'This name is already used' });
    }
  }
  // 3. Llamada al siguiente middleware o controlador
  next();
};

const findAll = async (req: Request, res: Response) => {
  try {
    const locations = await em.find(
      Location,
      {},
      {
        populate: [
          'vehicles',
          'vehicles.color',
          'vehicles.vehicleModel',
          'vehicles.vehicleModel.category',
          'vehicles.vehicleModel.brand',
          'vehicles.reservations',
          'vehicles.reservations.client',
        ],
      }
    );
    res.status(200).json({
      message: 'All locations have been found',
      data: locations,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const location = await em.findOne(
      Location,
      { id },
      {
        populate: [
          'vehicles',
          'vehicles.color',
          'vehicles.vehicleModel',
          'vehicles.vehicleModel.category',
          'vehicles.vehicleModel.brand',
          'vehicles.reservations',
          'vehicles.reservations.client',
        ],
      }
    );
    if (!location) {
      return res.status(404).json({ message: 'The location does not exist' });
    }
    else {
      res.status(200).json({
        message: 'The location has been found',
        data: location,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const location = em.create(Location, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The locations has been created', data: location });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const location = await em.findOne(Location, { id });
    if (!location) { 
      return res.status(404).json({ message: 'The location does not exist' });
    }
    else {
      const locationReference = em.getReference(Location, id);
      em.assign(locationReference, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The location has been updated' });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const location = await em.findOne(Location, { id });
    const locationInUse = await em.findOne( Vehicle, { location: id });
    if (!location) {
      return res.status(404).json({ message: 'The location does not exist' });
    }
    else if (locationInUse) {
      return res.status(400).json({ message: 'The location is in use' });
    }
    else {
      const locationReference = em.getReference(Location, id);
      await em.removeAndFlush(locationReference);
      res.status(200).send({ message: 'The location has been deleted' });
    }
    
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyLocationNameExists = async (req: Request, res: Response) => {
  try {
    const locationName = req.params.locationName;
    const id = Number.parseInt(req.params.id);
    const location = await em.findOneOrFail(
      Location,
      { locationName: locationName });
    if (location.id === id) {
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

export { sanitizedLocationInput, findAll, findOne, add, update, remove, verifyLocationNameExists };
