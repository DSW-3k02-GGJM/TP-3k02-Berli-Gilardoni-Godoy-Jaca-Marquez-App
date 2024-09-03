import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Client } from './client.entity.js';

const em = orm.em;

const sanitizedClientInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    documentType: req.body.documentType,
    documentID: req.body.documentID,
    clientName: req.body.clientName,
    clientSurname: req.body.clientSurname,
    birthDate: req.body.birthDate,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    nationality: req.body.nationality,
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
    const clients = await em.find(
      Client,
      {},
      {
        populate: [
          'reservations',
          'reservations.vehicle',
          'reservations.vehicle.location',
          'reservations.vehicle.color',
          'reservations.vehicle.vehicleModel',
          'reservations.vehicle.vehicleModel.category',
          'reservations.vehicle.vehicleModel.brand',
        ],
      }
    );
    res
      .status(200)
      .json({ message: 'All ', data: clients });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const client = await em.findOneOrFail(
      Client,
      { id },
      {
        populate: [
          'reservations',
          'reservations.vehicle',
          'reservations.vehicle.location',
          'reservations.vehicle.color',
          'reservations.vehicle.vehicleModel',
          'reservations.vehicle.vehicleModel.category',
          'reservations.vehicle.vehicleModel.brand',
        ],
      }
    );
    res.status(200).json({ message: 'All clients found', data: client });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const client = em.create(Client, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'The client has been created', data: client });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const client = em.getReference(Client, id);
    em.assign(client, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'The client has been updated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const client = em.getReference(Client, id);
    await em.removeAndFlush(client);
    res.status(200).send({ message: 'The client has been deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { sanitizedClientInput, findAll, findOne, add, update, remove };
