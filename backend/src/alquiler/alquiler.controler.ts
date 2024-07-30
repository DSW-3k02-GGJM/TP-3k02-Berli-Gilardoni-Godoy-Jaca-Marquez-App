import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Alquiler } from './alquiler.entity.js';

const em = orm.em;

const sanitizedAlquilerInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    fechaAlquiler: req.body.fechaAlquiler,
    fechaInicio: req.body.fechaInicio,
    fechaFinPactada: req.body.fechaFinPactada,
    fechaFinReal: req.body.fechaFinReal,
    fechaCancelacion: req.body.fechaCancelacion,
    kmIniciales: req.body.kmIniciales,
    kmFinales: req.body.kmFinales,
    cliente: req.body.cliente,
    vehiculo: req.body.vehiculo,
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
    const alquileres = await em.find(
      Alquiler,
      {},
      {
        populate: [
          'cliente',
          'vehiculo',
          'vehiculo.sucursal',
          'vehiculo.color',
          'vehiculo.modelo',
          'vehiculo.modelo.categoria',
          'vehiculo.modelo.marca',
        ],
      }
    );
    res
      .status(200)
      .json({ message: 'Todos los alquileres encontrados', data: alquileres });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const alquiler = await em.findOneOrFail(
      Alquiler,
      { id },
      {
        populate: [
          'cliente',
          'vehiculo',
          'vehiculo.sucursal',
          'vehiculo.color',
          'vehiculo.modelo',
          'vehiculo.modelo.categoria',
          'vehiculo.modelo.marca',
        ],
      }
    );
    res.status(200).json({ message: 'Alquiler encontrado', data: alquiler });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const alquiler = em.create(Alquiler, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'Alquiler creado', data: alquiler });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const alquiler = await em.findOneOrFail(Alquiler, { id });
    em.assign(alquiler, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'Alquiler actualizado', data: alquiler });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const alquiler = em.getReference(Alquiler, id);
    await em.removeAndFlush(alquiler);
    res.status(200).send({ message: 'Alquiler eliminado' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { sanitizedAlquilerInput, findAll, findOne, add, update, remove };
