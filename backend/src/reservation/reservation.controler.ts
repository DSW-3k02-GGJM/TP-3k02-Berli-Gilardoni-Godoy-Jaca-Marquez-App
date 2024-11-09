import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Reservation } from './reservation.entity.js';

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
    initialKms: req.body.initialKms,
    finalKm: req.body.finalKm,
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
  const initialKms = req.body.sanitizedInput.initialKms;
  const user = req.body.sanitizedInput.user;
  const vehicle = req.body.sanitizedInput.vehicle;

  console.log('Datos de la reserva:', req.body.sanitizedInput);
  console.log(!startDate, !plannedEndDate, !initialKms, !user, !vehicle);
  console.log(initialKms);
  if (!startDate || !plannedEndDate || !user || !vehicle) {
    return res.status(400).json({ message: 'All information is required' });
  }

  if (initialKms < 0) {
    return res
      .status(400)
      .json({ message: 'Initial kms must be greater than 0' });
  }

  next();
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

export { sanitizedReservationInput, findAll, findOne, add, update, remove };
