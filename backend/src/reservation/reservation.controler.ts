import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Reservation } from './reservation.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';
import { User } from '../user/user.entity.js';
import { ScheduleService } from '../shared/db/schedule.service.js';

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

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const startDate = req.body.sanitizedInput.startDate;
  const plannedEndDate = req.body.sanitizedInput.plannedEndDate;
  const user = req.body.sanitizedInput.user;
  const vehicle = req.body.sanitizedInput.vehicle;

  if (!startDate || !plannedEndDate || !user || !vehicle) {
    return res.status(400).json({ message: 'All information is required' });
  }

  next();
};

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
    return res.status(400).json({ message: 'All information is required' });
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
    return res.status(400).json({ message: 'All information is required' });
  }

  next();
};

const reservation = async (req: Request, res: Response) => {
  try {
    const reservationDate = req.body.reservationDate;
    const startDate = req.body.startDate;
    const plannedEndDate = req.body.plannedEndDate;
    const vehicle = req.body.vehicle;

    const userID = req.session.user.id;
    const user = await em.findOneOrFail(User, { id: userID });

    const vehicleSelected = await em.findOneOrFail(
      Vehicle,
      { id: vehicle },
      { populate: [] }
    );

    em.create(Reservation, {
      reservationDate: reservationDate,
      startDate: startDate,
      plannedEndDate: plannedEndDate,
      realEndDate: null,
      cancellationDate: null,
      initialKms: null,
      finalKm: null,
      user: user,
      vehicle: vehicleSelected,
    });
    ScheduleService.reservationReminder(user.email, startDate);
    await em.flush();
    res.status(201).end();
  } catch (error: any) {
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
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const reservationDate = req.body.reservationDate;
    const startDate = req.body.startDate;
    const plannedEndDate = req.body.plannedEndDate;
    const user = req.body.user;
    const vehicle = req.body.vehicle;

    const vehicleSelected = await em.findOneOrFail(
      Vehicle,
      { id: vehicle },
      { populate: [] }
    );

    em.create(Reservation, {
      reservationDate: reservationDate,
      startDate: startDate,
      plannedEndDate: plannedEndDate,
      realEndDate: null,
      cancellationDate: null,
      initialKms: null,
      finalKm: null,
      user: user,
      vehicle: vehicleSelected,
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
    res.status(500).json({ message: 'Server error' });
  }
};

const getReservationsByUser = async (req: Request, res: Response) => {
  try {
    const userID = req.session.user.id;

    if (!userID) {
      return res.status(400).json({ message: 'User ID not found in session' });
    }

    const reservationsByUser = await em.find(
      Reservation,
      { user: userID },
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

    if (reservationsByUser.length === 0) {
      return res
        .status(404)
        .json({ message: 'No reservations found for this user' });
    }

    res.status(200).json({
      message: 'All reservations have been found',
      data: reservationsByUser,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  sanitizedReservationInput,
  sanitizedAdminReservationInput,
  sanitizedUserReservationInput,
  findAll,
  findOne,
  add,
  update,
  remove,
  reservation,
  getReservationsByUser,
};
