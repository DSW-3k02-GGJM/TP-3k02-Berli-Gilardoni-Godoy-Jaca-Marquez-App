import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Vehicle } from './vehicle.entity.js';
import { Reservation } from '../reservation/reservation.entity.js';
import { Location } from '../location/location.entity.js';
import moment from 'moment';

const em = orm.em;

const sanitizedVehicleInput = async (
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

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const id = Number.parseInt(req.params.id);
  const licensePlate = req.body.sanitizedInput.licensePlate;
  const manufacturingYear = req.body.sanitizedInput.manufacturingYear;
  const totalKms = req.body.sanitizedInput.totalKms;
  const location = req.body.sanitizedInput.location;
  const color = req.body.sanitizedInput.color;
  const vehicleModel = req.body.sanitizedInput.vehicleModel;

  if (
    !licensePlate ||
    !manufacturingYear ||
    !location ||
    !color ||
    !vehicleModel
  ) {
    return res.status(400).json({ message: 'All information is required' });
  }

  if (totalKms < 0) {
    return res
      .status(400)
      .json({ message: 'Total kms must be greater than 0' });
  }

  const vehicle = await em.findOne(Vehicle, { licensePlate }, { populate: [] });
  if (vehicle) {
    if (vehicle.id !== id) {
      return res
        .status(400)
        .json({ message: 'This license plate is already used' });
    }
  }

  next();
};

const sanitizedFilterInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.query.sanitizedInput = {
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    location: req.query.location,
  };

  const { startDate, endDate, location } = req.query.sanitizedInput;

  if (!isValidDateFormat(startDate as string)) {
    return res.status(400).json({ message: 'Invalid or missing startDate' });
  } else if (moment(startDate as string).isBefore(moment())) {
    return res.status(400).json({
      message: "Invalid startDate. You can't book a reservation for the past!",
    });
  }

  if (!isValidDateFormat(endDate as string)) {
    return res.status(400).json({ message: 'Invalid or missing endDate' });
  } else if (moment(startDate as string).isAfter(moment(endDate as string))) {
    return res.status(400).json({
      message:
        "Invalid endDate. Your reservation can't end if it never started!",
    });
  }

  if (Number.isInteger(Number(location)) && !(Number(location) < 1)) {
    const storedLocation = await em.findOne(Location, {
      id: Number(location),
    });

    if (!storedLocation) {
      return res.status(400).json({ message: 'Invalid or missing location' });
    }
  }

  next();
};

function isValidDateFormat(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

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
          'reservations.user',
        ],
      }
    );
    res
      .status(200)
      .json({ message: 'All vehicles have been found', data: vehicles });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  console.log('findOne called');
  try {
    const id = Number.parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

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
          'reservations.user',
        ],
      }
    );

    if (!vehicle) {
      res.status(404).json({ message: 'The vehicle does not exist' });
    } else {
      res
        .status(200)
        .json({ message: 'The vehicle has been found', data: vehicle });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Vehicle, req.body.sanitizedInput);
    await em.flush();
    res.status(201).end();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOne(Vehicle, { id });
    if (!vehicle) {
      res.status(404).json({ message: 'The vehicle does not exist' });
    } else {
      em.assign(vehicle, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: 'The vehicle has been updated', data: vehicle });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOne(Vehicle, { id });
    const vehicleInUse = await em.findOne(Reservation, { vehicle: id }); //TODO: Deberia poder ponerse a los vehiculos en baja independientemente si estan en una reserva
    if (!vehicle) {
      res.status(404).json({ message: 'The vehicle does not exist' });
    } else if (vehicleInUse) {
      res.status(400).json({ message: 'The vehicle is in use' });
    } else {
      const vehicleReference = em.getReference(Vehicle, id); //TODO: Problablemente no haga falta obtener las referencias, se podría usar vehicle tal cual
      await em.removeAndFlush(vehicleReference);
      res.status(200).json({ message: 'The vehicle has been deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyLicensePlateExists = async (req: Request, res: Response) => {
  try {
    const licensePlate = req.params.licensePlate;
    const id = Number.parseInt(req.params.id);
    const vehicle = await em.findOneOrFail(Vehicle, {
      licensePlate: licensePlate,
    });
    if (vehicle.id === id) {
      res.status(200).json({ exists: false });
    } else {
      res.status(200).json({ exists: true });
    }
  } catch (error: any) {
    res.status(200).json({ exists: false });
  }
};

export const findAvailable = async (req: Request, res: Response) => {
  try {
    const filter: any = req.query.sanitizedInput;

    // Busco las reservas activas que se superponen con el
    // rango de fechas indicado en el filtro de la solicitud
    const reservations = await em.find(
      Reservation,
      {
        $and: [
          { realEndDate: null },
          { cancellationDate: null },
          { startDate: { $lte: filter.endDate } },
          { plannedEndDate: { $gte: filter.startDate } },
        ],
      },
      {
        populate: ['vehicle'],
      }
    );

    // Armo un filtro para los vehiculos, en el que busco aquellos
    // que sean de la location indicada en el filtro de la solicitud,
    // y cuyos id no coincidan con ningun id de los vehiculos asociados
    // a cada una de las reservas activas que se superponen en las fechas
    // (reservas obtenidas en la consulta anterior)
    const vehicleFilters: any[] = [
      {
        $and: [
          { 'l1.id': filter.location },
          { id: { $nin: reservations.map((res) => res.vehicle.id) } },
        ],
      },
    ];

    // Busco los vehiculos que cumplan con el filtro anterior (vehicleFilters)
    const vehicles = await em.find(Vehicle, vehicleFilters, {
      populate: [
        'location',
        'vehicleModel',
        'vehicleModel.category',
        'vehicleModel.brand',
      ],
    });

    // Armo un "Diccionario" en el que la key es el nombre del modelo y el
    // valor es un array de objetos Vehicle de ese modelo
    const vehiclesByModel: { [key: string]: Vehicle[] } = {};

    // Recorro el array de Vehicles y los guardo en el diccionario
    vehicles.forEach((vehicle) => {
      const modelName = vehicle.vehicleModel.vehicleModelName;
      if (!vehiclesByModel[modelName]) {
        vehiclesByModel[modelName] = [];
      }
      vehiclesByModel[modelName].push(vehicle);
    });

    // Armo la respuesta final como un arreglo, en el que para cada
    // modelo devuelvo el primer vehiculo disponible
    const responseData = Object.keys(vehiclesByModel).map(
      (modelName) => vehiclesByModel[modelName][0]
    );

    // Devuelvo un codigo de respuesta OK con la informacion de responseData
    res.status(200).json({
      message: 'All vehicles have been found',
      data: responseData,
    });
  } catch (error: any) {
    // Si algo falla, devuelvo un codigo de respuesta que indica que hubo un error,
    // junto a un mensaje descriptivo del mismo
    res.status(500).json({ message: error.message });
  }
};

export {
  sanitizedVehicleInput,
  sanitizedFilterInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  verifyLicensePlateExists,
};
