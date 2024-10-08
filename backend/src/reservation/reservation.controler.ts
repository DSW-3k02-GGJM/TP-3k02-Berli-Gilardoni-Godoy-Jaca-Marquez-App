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
    client: req.body.client,
    vehicle: req.body.vehicle,
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
    const reservations = await em.find(
      Reservation,
      {},
      {
        populate: [
          'client',
          'vehicle',
          'vehicle.location',
          'vehicle.color',
          'vehicle.vehicleModel',
          'vehicle.vehicleModel.category',
          'vehicle.vehicleModel.brand',
        ],
      }
    );
    res
      .status(200)
      .json({ message: 'All reservations have been found', data: reservations });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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
          'client',
          'vehicle',
          'vehicle.location',
          'vehicle.color',
          'vehicle.vehicleModel',
          'vehicle.vehicleModel.category',
          'vehicle.vehicleModel.brand',
        ],
      }
    );
    res.status(200).json({ message: 'The reservation has been found', data: reservation });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const reservation = em.create(Reservation, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The reservation has been created', data: reservation });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const reservation = await em.findOneOrFail(Reservation, { id });
    em.assign(reservation, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'The reservation has been updated', data: reservation });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const reservation = em.getReference(Reservation, id);
    await em.removeAndFlush(reservation);
    res.status(200).send({ message: 'The reservation has been deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { sanitizedReservationInput, findAll, findOne, add, update, remove };
