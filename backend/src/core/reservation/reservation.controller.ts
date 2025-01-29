// Express
import { Request, Response } from 'express';

// MikroORM
import { EntityManager } from '@mikro-orm/core';
import { orm } from '../../shared/database/orm.js';

// Entities
import { Reservation } from './reservation.entity.js';
import { Reminder } from '../reminder/reminder.entity.js';

// External Libraries
import { subDays } from 'date-fns';

const em = orm.em;

const findAll = async (_req: Request, res: Response) => {
  try {
    const reservations = await em.find(
      Reservation,
      {},
      {
        populate: ['user', 'vehicle.vehicleModel.category'],
      }
    );
    res.status(200).json({
      message: 'Todas las reservas han sido encontradas',
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const add = async (req: Request, res: Response) => {
  const orm = em.fork();
  await orm.begin();

  try {
    const reservationInput = req.body.sanitizedInput;
    const { startDate, plannedEndDate, vehicle } = reservationInput;

    const existingReservation = await validateReservation(
      orm,
      vehicle,
      startDate,
      plannedEndDate
    );

    if (existingReservation) {
      await orm.rollback();
      return res.status(400).json({
        message:
          'El vehículo ya no está disponible para las fechas seleccionadas. Por favor, seleccione otro vehículo o intente con otro rango de fechas.',
      });
    }

    await createReservation(orm, reservationInput, reservationInput.user);

    await orm.flush();
    await orm.commit();

    res.status(201).json({ message: 'Reserva exitosa' });
  } catch (error) {
    await orm.rollback();
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const reservation = await em.findOne(Reservation, { id });
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    } else {
      em.assign(reservation, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: 'La reserva ha sido actualizada exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const checkOut = async (req: Request, res: Response) => {
  const orm = em.fork();
  await orm.begin();

  try {
    const id = Number.parseInt(req.params.id);

    const reservation = await orm.findOne(
      Reservation,
      { id },
      { populate: ['vehicle'] }
    );

    if (!reservation) {
      await orm.rollback();
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    const vehicle = reservation.vehicle;

    orm.assign(vehicle, { totalKms: req.body.sanitizedInput.finalKms });
    orm.assign(reservation, req.body.sanitizedInput);

    await orm.flush();
    await orm.commit();

    res.status(200).json({
      message: 'Se ha realizado el check-out de la reserva exitosamente',
    });
  } catch (error) {
    await orm.rollback();
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const reservation = await em.findOne(
      Reservation,
      { id },
      { populate: ['reminders'] }
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    const reminders = reservation.reminders.getItems();
    const hasSentReminders = reminders.some((reminder) => reminder.sent);
    if (hasSentReminders) {
      return res.status(400).json({
        message:
          'La reserva no se puede eliminar porque ya se ha enviado un recordatorio al cliente.',
      });
    }
    await em.removeAndFlush(reservation);
    res
      .status(200)
      .json({ message: 'La reserva ha sido eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const getReservationsByUser = async (req: Request, res: Response) => {
  try {
    const reservationsByUser = await em.find(
      Reservation,
      { user: req.session.user.id },
      {
        populate: [
          'vehicle.vehicleModel.brand',
          'vehicle.vehicleModel.category',
        ],
      }
    );
    res.status(200).json({
      message: 'Todas sus reservas han sido encontradas',
      data: reservationsByUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const userReservation = async (req: Request, res: Response) => {
  const orm = em.fork();
  await orm.begin();

  try {
    const reservationInput = req.body.sanitizedInput;
    const { startDate, plannedEndDate, vehicle } = reservationInput;

    const existingReservation = await validateReservation(
      orm,
      vehicle,
      startDate,
      plannedEndDate
    );

    if (existingReservation) {
      await orm.rollback();
      return res.status(400).json({
        message:
          'El vehículo ya no está disponible para las fechas seleccionadas. Por favor, seleccione otro vehículo o intente con otro rango de fechas.',
      });
    }

    await createReservation(orm, reservationInput, req.session.user.id);

    await orm.flush();
    await orm.commit();

    res.status(201).json({ message: 'Reserva exitosa' });
  } catch (error) {
    await orm.rollback();
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const validateReservation = async (
  em: EntityManager,
  vehicle: number,
  startDate: string,
  plannedEndDate: string
) => {
  return em.findOne(Reservation, {
    vehicle,
    realEndDate: null,
    cancellationDate: null,
    startDate: { $lte: plannedEndDate },
    plannedEndDate: { $gte: startDate },
  });
};

const createReservation = async (
  em: EntityManager,
  reservationInput: any,
  userId: number
) => {
  const reservation = em.create(Reservation, {
    ...reservationInput,
    user: userId,
  });
  em.create(Reminder, {
    reminderDate: getReminderDate(reservation.startDate),
    sent: false,
    reservation,
  });
  return reservation;
};

const getReminderDate = (reservationStartDate: string) => {
  return subDays(reservationStartDate, 1).toISOString().split('T')[0];
};

export {
  findAll,
  add,
  update,
  checkOut,
  remove,
  getReservationsByUser,
  userReservation,
};
