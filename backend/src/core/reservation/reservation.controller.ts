// Express
import { Request, Response, NextFunction } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { Reservation } from './reservation.entity.js';
import { Reminder } from '../reminder/reminder.entity.js';

const em = orm.em;

const sanitizedAdminReservationInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    reservationDate: req.body.reservationDate,
    startDate: req.body.startDate,
    plannedEndDate: req.body.plannedEndDate,
    user: req.body.user,
    vehicle: req.body.vehicle,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const reservationDate = req.body.sanitizedInput.reservationDate;
  const startDate = req.body.sanitizedInput.startDate;
  const plannedEndDate = req.body.sanitizedInput.plannedEndDate;
  const user = req.body.sanitizedInput.user;
  const vehicle = req.body.sanitizedInput.vehicle;

  if (!reservationDate || !startDate || !plannedEndDate || !user || !vehicle) {
    res.status(400).json({ message: 'All information is required' });
  }

  next();
};

const sanitizedUserReservationInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    reservationDate: req.body.reservationDate,
    startDate: req.body.startDate,
    plannedEndDate: req.body.plannedEndDate,
    vehicle: req.body.vehicle,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const reservationDate = req.body.sanitizedInput.reservationDate;
  const startDate = req.body.sanitizedInput.startDate;
  const plannedEndDate = req.body.sanitizedInput.plannedEndDate;
  const vehicle = req.body.sanitizedInput.vehicle;

  if (!reservationDate || !startDate || !plannedEndDate || !vehicle) {
    res.status(400).json({ message: 'All information is required' });
  }

  next();
};

const sanitizedUpdateReservationInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    realEndDate: req.body.realEndDate,
    cancellationDate: req.body.cancellationDate,
    initialKms: req.body.initialKms,
    finalKms: req.body.finalKms,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const { realEndDate, cancellationDate, initialKms, finalKms } =
    req.body.sanitizedInput;

  if (realEndDate && isNaN(new Date(realEndDate).getTime())) {
    return res.status(400).json({ message: 'Invalid realEndDate format' });
  }

  if (cancellationDate && isNaN(new Date(cancellationDate).getTime())) {
    return res.status(400).json({ message: 'Invalid cancellationDate format' });
  }

  if (
    initialKms !== undefined &&
    initialKms !== null &&
    (isNaN(initialKms) || initialKms < 0)
  ) {
    return res
      .status(400)
      .json({ message: 'initialKms must be a positive number' });
  }

  if (
    finalKms !== undefined &&
    finalKms !== null &&
    (isNaN(finalKms) || finalKms < 0)
  ) {
    return res
      .status(400)
      .json({ message: 'finalKms must be a positive number' });
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
    res.status(500).json({ message: 'Server error' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const reservation = await em.findOne(
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
      res.status(404).json({ message: 'The reservation does not exist' });
    } else {
      res
        .status(200)
        .json({ message: 'The reservation has been found', data: reservation });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const reservation = em.create(Reservation, req.body.sanitizedInput);

    const reminderDate = new Date(req.body.startDate);
    reminderDate.setHours(reminderDate.getHours() + 3);
    reminderDate.setDate(reminderDate.getDate() - 1);

    em.create(Reminder, {
      reminderDate,
      sent: false,
      reservation,
    });
    await em.flush();
    res.status(201).end();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const reservation = await em.findOne(Reservation, { id });
    if (!reservation) {
      return res
        .status(404)
        .json({ message: 'The reservation does not exist' });
    } else {
      em.assign(reservation, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The reservation has been updated' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const reservation = await em.findOne(Reservation, { id });
    const reservationInUse = await em.findOne(Reminder, { reservation: id });
    if (!reservation) {
      res.status(404).json({ message: 'Reservation does not exist' });
    } else if (reservationInUse) {
      res.status(400).json({ message: 'The reservation is in use' });
    } else {
      await em.removeAndFlush(reservation);
      res.status(200).send({ message: 'The reservation has been deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const userReservation = async (req: Request, res: Response) => {
  try {
    const reservation = em.create(Reservation, {
      ...req.body.sanitizedInput,
      user: req.session.user.id,
    });

    const reminderDate = new Date(req.body.startDate);
    reminderDate.setHours(reminderDate.getHours() + 3);
    reminderDate.setDate(reminderDate.getDate() - 1);

    em.create(Reminder, {
      reminderDate,
      sent: false,
      reservation,
    });
    await em.flush();
    res.status(201).end();
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getReservationsByUser = async (req: Request, res: Response) => {
  try {
    const reservationsByUser = await em.find(
      Reservation,
      { user: req.session.user.id },
      {
        populate: [
          'vehicle',
          'vehicle.vehicleModel',
          'vehicle.vehicleModel.category',
          'vehicle.vehicleModel.brand',
        ],
      }
    );
    res.status(200).json({
      message: 'All reservations have been found',
      data: reservationsByUser,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  sanitizedAdminReservationInput,
  sanitizedUserReservationInput,
  sanitizedUpdateReservationInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  userReservation,
  getReservationsByUser,
};
