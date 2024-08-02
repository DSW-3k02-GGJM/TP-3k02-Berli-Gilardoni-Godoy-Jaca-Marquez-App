import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { Sucursal } from './sucursal.entity.js';

const em = orm.em;

const findAll = async (req: Request, res: Response) => {
  try {
    const sucursales = await em.find(
      Sucursal,
      {},
      {
        populate: [
          'vehiculos',
          'vehiculos.color',
          'vehiculos.modelo',
          'vehiculos.modelo.categoria',
          'vehiculos.modelo.marca',
          'vehiculos.alquileres',
          'vehiculos.alquileres.cliente',
        ],
      }
    );
    res.status(200).json({
      message: 'Todas las sucursales encontradas',
      data: sucursales,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const sucursal = await em.findOneOrFail(
      Sucursal,
      { id },
      {
        populate: [
          'vehiculos',
          'vehiculos.color',
          'vehiculos.modelo',
          'vehiculos.modelo.categoria',
          'vehiculos.modelo.marca',
          'vehiculos.alquileres',
          'vehiculos.alquileres.cliente',
        ],
      }
    );
    res.status(200).json({
      message: 'Sucursal encontrada',
      data: sucursal,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const sucursal = em.create(Sucursal, req.body);
    await em.flush();
    res.status(201).json({ message: 'Sucursal creada', data: sucursal });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const sucursal = em.getReference(Sucursal, id);
    em.assign(sucursal, req.body);
    await em.flush();
    res.status(200).json({ message: 'Sucursal actualizada' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const sucursal = em.getReference(Sucursal, id);
    await em.removeAndFlush(sucursal);
    res.status(200).send({ message: 'Sucursal eliminada' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { findAll, findOne, add, update, remove };
