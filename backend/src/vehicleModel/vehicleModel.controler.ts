import {NextFunction, Request, Response} from 'express';
import { orm } from '../shared/db/orm.js';
import { VehicleModel } from './vehicleModel.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

const em = orm.em;

const sanitizedVehicleModelInput = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  // 1. Creación del objeto `sanitizedInput` en `req.body`
  req.body.sanitizedInput = {
    vehicleModelName: req.body.vehicleModelName,
    transmissionType: req.body.transmissionType,
    passengerCount: req.body.passengerCount,
    imagePath: req.body.imagePath,
    category: req.body.category,
    brand: req.body.brand,
    vehicles: req.body.vehicles,
  };
  // 2. Eliminación de claves indefinidas en `sanitizedInput`
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  // 3. Llamada al siguiente middleware o controlador

  const id = Number.parseInt(req.params.id);
  const vehicleModelName = req.body.sanitizedInput.vehicleModelName;
  const transmissionType = req.body.sanitizedInput.transmissionType;
  const passengerCount = req.body.sanitizedInput.passengerCount;
  const imagePath = req.body.sanitizedInput.imagePath;
  const category = req.body.sanitizedInput.category;
  const brand = req.body.sanitizedInput.brand;

  if (!vehicleModelName || !transmissionType || !passengerCount || !category || !brand) {
    return res.status(400).json({ message: 'All information is required' });
  }

  if (passengerCount < 0) {
    return res.status(400).json({ message: 'Passenger count must be greater than 0' });
  }

  const vehicleModel = await em.findOne( VehicleModel , { vehicleModelName } , {populate: [] , });
  if(vehicleModel){
    if (vehicleModel.id !== id) {
      return res.status(400).json({ message: 'This name is already used' });
    }
  }

  next();
};

const findAll = async (req: Request, res: Response) => {
  try {
    const vehicleModels = await em.find(
      VehicleModel,
      {},
      {
        populate: [
          'category',
          'brand',
          'vehicles',
          'vehicles.location',
          'vehicles.color',
          'vehicles.reservations',
          'vehicles.reservations.client',
        ],
      }
    );
    res.status(200).json({
      message: 'All vehicle models have been found',
      data: vehicleModels,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const modelo = await em.findOne(
      VehicleModel,
      { id },
      {
        populate: [
          'category',
          'brand',
          'vehicles',
          'vehicles.location',
          'vehicles.color',
          'vehicles.reservations',
          'vehicles.reservations.client',
        ],
      }
    );
    if (!modelo) { 
      res.status(404).json({ message: 'The vehicle model does not exist' });
    }
    else {
      res.status(200).json({
        message: 'The vehicle model has been found',
        data: modelo,
      });
    }

  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const vehicleModel = em.create(VehicleModel, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The vehicle model has been created', data: vehicleModel });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicleModel = await em.findOne(VehicleModel, { id });
    if (!vehicleModel) {
      res.status(404).json({ message: 'The vehicle model does not exist' });
    }
    else {
      em.assign(vehicleModel, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The vehicle model has been updated', data: vehicleModel });
    }
    
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicleModel = await em.findOne(VehicleModel, { id });
    const vehicleModelInUse = await em.findOne( Vehicle, { vehicleModel: id });
    if (!vehicleModel) {
      res.status(404).json({ message: 'The vehicle model does not exist' });
    }
    else if (vehicleModelInUse) {
      res.status(400).json({ message: 'The vehicle model is in use' });
    }
    else {
      const vehicleModelReference = em.getReference(VehicleModel, id);
      await em.removeAndFlush(vehicleModelReference);
      res.status(200).send({ message: 'The vehicle model has been deleted' });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyVehicleModelNameExists = async (req: Request, res: Response) => {
  try {
    const vehicleModelName = req.params.vehicleModelName;
    const id = Number.parseInt(req.params.id);
    const vehicleModel = await em.findOneOrFail(
      VehicleModel,
      { vehicleModelName: vehicleModelName });
    if (vehicleModel.id === id) {
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

export { sanitizedVehicleModelInput, findAll, findOne, add, update, remove, verifyVehicleModelNameExists };
