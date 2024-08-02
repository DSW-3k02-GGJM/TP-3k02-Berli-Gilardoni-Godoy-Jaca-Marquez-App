import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { Modelo } from './modelo.entity.js';

const em = orm.em;

const findAll = async (req: Request, res: Response) => {
  try {
    const modelos = await em.find(
      Modelo,
      {},
      {
        populate: [
          'categoria',
          'marca',
          'vehiculos',
          'vehiculos.sucursal',
          'vehiculos.color',
          'vehiculos.alquileres',
          'vehiculos.alquileres.cliente',
        ],
      }
    );
    res.status(200).json({
      message: 'Todos los modelos encontrados',
      data: modelos,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const modelo = await em.findOneOrFail(
      Modelo,
      { id },
      {
        populate: [
          'categoria',
          'marca',
          'vehiculos',
          'vehiculos.sucursal',
          'vehiculos.color',
          'vehiculos.alquileres',
          'vehiculos.alquileres.cliente',
        ],
      }
    );
    res.status(200).json({
      message: 'Modelo encontrado',
      data: modelo,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const modelo = em.create(Modelo, req.body);
    await em.flush();
    res.status(201).json({ message: 'Modelo creado', data: modelo });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const modelo = await em.findOneOrFail(Modelo, { id });
    em.assign(modelo, req.body);
    await em.flush();
    res.status(200).json({ message: 'Modelo actualizado', data: modelo });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const modelo = em.getReference(Modelo, id);
    await em.removeAndFlush(modelo);
    res.status(200).send({ message: 'Modelo eliminado' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { findAll, findOne, add, update, remove };
