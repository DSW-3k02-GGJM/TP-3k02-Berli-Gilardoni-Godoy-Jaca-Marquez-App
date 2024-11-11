import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Vehicle } from './vehicle.entity.js';
import { Reservation } from '../reservation/reservation.entity.js';
import { Location } from '../location/location.entity.js';

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
  // Más validaciones
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
  console.log('Received startDate:', startDate, 'Type:', typeof startDate);
  console.log('parsed as: ', new Date(startDate as string));
  console.log('Received endDate:', endDate, 'Type:', typeof endDate);
  console.log('parsed as: ', new Date(endDate as string));
  console.log('Received location:', location, 'Type:', typeof location);

  //TODO: usar timezones
  if (!isValidDateFormat(startDate as string)) {
    return res.status(400).json({ message: 'Invalid or missing startDate' });
  } else {
    //fecha ingresada 1ms antes de medianoche
    if (
      new Date(Date.parse(startDate as string) + 86400000 - 1) <
      new Date(Date.now())
    ) {
      return res.status(400).json({
        message:
          "Invalid startDate. You can't book a reservation for the past!",
      });
    }
  }

  if (!isValidDateFormat(endDate as string)) {
    return res.status(400).json({ message: 'Invalid or missing endDate' });
  } else {
    //fecha ingresada 1ms antes de medianoche
    if (
      new Date(Date.parse(startDate as string) + 86400000 - 1) >
      new Date(Date.parse(endDate as string) + 86400000 - 1)
    ) {
      return res.status(400).json({
        message:
          "Invalid endDate. You reservation can't end if it never started!",
      });
    }
  }

  if (
    !Number.isInteger(Number(location)) ||
    Number(location) < 1 ||
    Number(location) > (await em.count(Location))
  ) {
    console.log(!Number.isInteger(Number(location)));
    console.log(Number(location) < 1);
    console.log(await em.count(Location));
    return res.status(400).json({ message: 'Invalid or missing location' });
  }

  next();
};

function isValidDateFormat(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
  if (!regex.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 && // JavaScript months are 0-indexed
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
    console.log('Received ID:', req.params.id); // Log the received ID
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
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const vehicle = em.create(Vehicle, req.body.sanitizedInput);
    await em.flush();
    res
      .status(201)
      .json({ message: 'The vehicle has been created', data: vehicle });
  } catch (error: any) {
    console.log(error.message);
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
    console.log(error.message);
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
    console.log(error.message);
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
    const filters: any = {};

    filters.$and = [];
    filters.$and.push({ 'l1.id': filter.location });

    const reservationFilters: any[] = [];
    // Cuando hago los filtros, toma un día antes, por eso le sumo 1 día
    filter.startDate = new Date(filter.startDate);
    filter.endDate = new Date(filter.endDate);
    // TODO: usar timezones
    reservationFilters.push({
      $or: [
        { 'r6.startDate': { $eq: null } },
        { 'r6.cancellation_date': { $ne: null } },
        {
          $or: [
            {
              'r6.startDate': {
                $gt: new Date(
                  filter.endDate.setDate(filter.endDate.getDate() + 1)
                ),
              },
            },
            {
              'r6.planned_end_date': {
                $lt: new Date(
                  filter.startDate.setDate(filter.startDate.getDate() + 1)
                ),
              },
            },
          ],
        },
      ],
    });
    filters.$and.push({ $and: reservationFilters });

    const vehicles = await em.find(Vehicle, filters, {
      populate: [
        'location',
        'color',
        'vehicleModel',
        'vehicleModel.category',
        'vehicleModel.brand',
        'reservations',
        'reservations.user',
      ],
    });

    // Agrupar vehículos por modelo
    const vehiclesByModel: { [key: string]: Vehicle[] } = {};

    vehicles.forEach((vehicle) => {
      const modelName = vehicle.vehicleModel.vehicleModelName;
      if (!vehiclesByModel[modelName]) {
        vehiclesByModel[modelName] = [];
      }
      vehiclesByModel[modelName].push(vehicle);
    });

    // Convertir el objeto a un arreglo para la respuesta
    // Este arreglo guarda el nombre de cada modelo y el primer vehículo disponible para el mismo
    const responseData = Object.keys(vehiclesByModel).map((modelName) => ({
      vehicleModel: modelName,
      vehicle: {
        id: vehiclesByModel[modelName][0].id,
        licensePlate: vehiclesByModel[modelName][0].licensePlate,
        manufacturingYear: vehiclesByModel[modelName][0].manufacturingYear,
        totalKms: vehiclesByModel[modelName][0].totalKms,
        location: vehiclesByModel[modelName][0].location,
        vehicleModel: vehiclesByModel[modelName][0].vehicleModel,
        color: vehiclesByModel[modelName][0].color,
        reservations: vehiclesByModel[modelName][0].reservations,
        brand: vehiclesByModel[modelName][0].vehicleModel.brand.brandName,
      },
    }));

    res.status(200).json({
      message: 'All vehicles have been found',
      data: responseData,
    });
  } catch (error: any) {
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
