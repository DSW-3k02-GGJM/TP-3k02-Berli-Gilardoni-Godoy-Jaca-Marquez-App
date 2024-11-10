import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Reservation } from './reservation.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';
import { User } from '../user/user.entity.js';

const em = orm.em;

const sanitizedReservationInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    reservationDate: req.body.reservationDate,
    startDate: req.body.startDate,
    plannedEndDate: req.body.plannedEndDate,
    realEndDate: req.body.realEndDate,
    cancellationDate: req.body.cancellationDate,
    user: req.body.user,
    vehicle: req.body.vehicle,
  };
  // Más validaciones
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const id = Number.parseInt(req.params.id);
  const startDate = req.body.sanitizedInput.startDate;
  const plannedEndDate = req.body.sanitizedInput.plannedEndDate;
  const user = req.body.sanitizedInput.user;
  const vehicle = req.body.sanitizedInput.vehicle;

  console.log('Datos de la reserva:', req.body.sanitizedInput);
  console.log(!startDate, !plannedEndDate, !user, !vehicle);
  if (!startDate || !plannedEndDate || !user || !vehicle) {
    return res.status(400).json({ message: 'All information is required' });
  }


  next();
};

const sanitizeUserdReservationInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    reservationDate: req.body.reservationDate,
    startDate: req.body.startDate,
    plannedEndDate: req.body.plannedEndDate,
    location: req.body.location,
    vehicleModel: req.body.vehicleModel,
  };
  // Más validaciones
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const id = Number.parseInt(req.params.id);
  const reservationDate = req.body.sanitizedInput.reservationDate;
  const startDate = req.body.sanitizedInput.startDate;
  const plannedEndDate = req.body.sanitizedInput.plannedEndDate;
  const location = req.body.sanitizedInput.location;
  const vehicleModel = req.body.sanitizedInput.vehicleModel;

  if (!startDate || !plannedEndDate || !location || !vehicleModel || !reservationDate) {
    return res.status(400).json({ message: 'All information is required' });
  }

  next();
};

const reservation = async (req: Request, res: Response) => {
  try {
    const reservationDate = req.body.reservationDate;
    const startDate = req.body.startDate;
    const plannedEndDate = req.body.plannedEndDate;
    const location = req.body.location;
    const vehicleModel = req.body.vehicleModel;

    const userId = req.session.user.id;
    const user = await em.findOneOrFail(User, { id: userId });

    const vehicleSelected = await em.findOneOrFail( Vehicle, {id : 1}, { populate: [], });
    const reservation = em.create(Reservation, {
      reservationDate: reservationDate,
      startDate: startDate,
      plannedEndDate: plannedEndDate,
      realEndDate: null,
      cancellationDate: null,
      user: user,
      vehicle: vehicleSelected,
    });

    await em.flush();
    res
      .status(201)
      .json({ message: 'The reservation has been created', data: reservation });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const findAll = async (req: Request, res: Response) => {
  try {
    const reservations = await em.find(
      Reservation,
      {},
      {
        populate: [
          'user',
          'vehicle',
          'vehicle.location',
          'vehicle.color',
          'vehicle.vehicleModel',
          'vehicle.vehicleModel.category',
          'vehicle.vehicleModel.brand',
        ],
      }
    );
    res.status(200).json({
      message: 'All reservations have been found',
      data: reservations,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const reservation = await em.findOneOrFail(
      Reservation,
      { id },
      {
        populate: [
          'user',
          'vehicle',
          'vehicle.location',
          'vehicle.color',
          'vehicle.vehicleModel',
          'vehicle.vehicleModel.category',
          'vehicle.vehicleModel.brand',
        ],
      }
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    } else {
      res
        .status(200)
        .json({ message: 'The reservation has been found', data: reservation });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const reservation = em.create(Reservation, req.body.sanitizedInput);
    await em.flush();
    res
      .status(201)
      .json({ message: 'The reservation has been created', data: reservation });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

//TODO: crear funcion para agregar reserva del pov user con req.session.user.id y asignar vehiculo

const update = async (req: Request, res: Response) => {
  console.log('Datos recibidos en el backend: ', req.body);
  console.log('Id Reserva Buscada: ' + req.params.id);

  try {
    const id = Number.parseInt(req.params.id);
    const reservation = await em.findOne(Reservation, { id });

    console.log('Reserva Encontrada: ' + reservation);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    } else {
      em.assign(reservation, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({
        message: 'The reservation has been updated',
        data: reservation,
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const reservation = await em.findOne(Reservation, { id });
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    } else {
      const reservationReference = em.getReference(Reservation, id);
      await em.removeAndFlush(reservationReference);
      res.status(200).send({ message: 'The reservation has been deleted' });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export { sanitizedReservationInput, sanitizeUserdReservationInput, findAll, findOne, add, update, remove, reservation };
