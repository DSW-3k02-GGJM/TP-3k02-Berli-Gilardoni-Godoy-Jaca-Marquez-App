import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Vehicle } from './vehicle.entity.js';
import { VehicleModel } from '../vehicleModel/vehicleModel.entity.js';

// pruebo esto para la parte del filtro
import { EntityManager, EntityRepository } from '@mikro-orm/mysql'; // or any other driver package





const em = orm.em;

const sanitizedVehicleInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    licensePlate: req.body.licensePlate,
    manufacturingYear: req.body.manufacturingYear,
    totalKms: req.body.totalKms,
    location: req.body.location,
    color: req.body.color,
    vehicleModel: req.body.vehicleModel,
    reservations: req.body.reservations,
  };
  // Más validaciones
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
};

const findAll = async (req: Request, res: Response) => {
  try {
    const vehicles = await em.find(
      Vehicle,
      {},
      {
        populate: [
          'location',
          'color',
          'vehicleModel',
          'vehicleModel.category',
          'vehicleModel.brand',
          'reservations',
          'reservations.client',
        ],
      }
    );
    res
      .status(200)
      .json({ message: 'All vehicles have been found', data: vehicles });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOneOrFail(
      Vehicle,
      { id },
      {
        populate: [
          'location',
          'color',
          'vehicleModel',
          'vehicleModel.category',
          'vehicleModel.brand',
          'reservations',
          'reservations.client',
        ],
      }
    );
    res.status(200).json({ message: 'The vehicle has been found', data: vehicle });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const vehicle = em.create(Vehicle, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The vehicle has been created', data: vehicle });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOneOrFail(Vehicle, { id });
    em.assign(vehicle, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'The vehicle has been updated', data: vehicle });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = em.getReference(Vehicle, id);
    await em.removeAndFlush(vehicle);
    res.status(200).send({ message: 'The vehicle has been deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// hago la funcion para el filtor
// Asegúrate de tener el EntityManager disponible aquí


import { SqlEntityManager } from '@mikro-orm/mysql'; // Asegúrate de importar el SqlEntityManager


export const getAvailableVehicleModelsHandler = async (req: Request, res: Response) => {
  /*
  const { fechaDesde, fechaHasta } = req.query;

  try {
    const em: SqlEntityManager = req.em as SqlEntityManager; // Asegúrate de castear a SqlEntityManager

    // Consulta utilizando Knex
    const availableModels = await em.getKnex().select('vm.*')
      .from('vehicle_model as vm')
      .leftJoin('reservation as r', 'vm.id', 'r.vehicle_id')
      .where(function() {
        this.whereNull('r.start_date')
          .orWhere('r.end_date', '<=', new Date(fechaDesde as string))
          .orWhere('r.start_date', '>=', new Date(fechaHasta as string));
      })
      .groupBy('vm.id')
      .havingRaw('COUNT(r.id) = 0');

    // Devolver los modelos disponibles
    res.json({ data: availableModels });
  } catch (error) {
    console.error('Error fetching available vehicle models:', error);
    res.status(500).json({ error: 'Error fetching available vehicle models' });
  }
*/

  try {
    const em: SqlEntityManager = req.em as SqlEntityManager; // Asegúrate de castear a SqlEntityManager

    // Consulta para obtener todos los modelos de vehículos
    const allModels = await em.getKnex().select('*')
      .from('vehicle_model');

    // Devolver todos los modelos de vehículos
    res.json({ data: allModels });
  } catch (error) {
    console.error('Error fetching all vehicle models:', error);
    res.status(500).json({ error: 'Error fetching all vehicle models' });
  }

};

export { sanitizedVehicleInput, findAll, findOne, add, update, remove };
