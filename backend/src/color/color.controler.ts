import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { Color } from './color.entity.js';

const em = orm.em;

const findAll = async (req: Request, res: Response) => {
  try {
    const colores = await em.find(
      Color,
      {},
      {
        populate: [
          'vehiculos',
          'vehiculos.sucursal',
          'vehiculos.modelo',
          'vehiculos.modelo.categoria',
          'vehiculos.modelo.marca',
          'vehiculos.alquileres',
          'vehiculos.alquileres.cliente',
        ],
      }
    );
    res.status(200).json({
      message: 'Todos los colores encontrados',
      data: colores,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = await em.findOneOrFail(
      Color,
      { id },
      {
        populate: [
          'vehiculos',
          'vehiculos.sucursal',
          'vehiculos.modelo',
          'vehiculos.modelo.categoria',
          'vehiculos.modelo.marca',
          'vehiculos.alquileres',
          'vehiculos.alquileres.cliente',
        ],
      }
    );
    res.status(200).json({
      message: 'Color encontrado',
      data: color,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const color = em.create(Color, req.body);
    await em.flush();
    res.status(201).json({ message: 'Color creado', data: color });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = em.getReference(Color, id);
    em.assign(color, req.body);
    await em.flush();
    res.status(200).json({ message: 'Color actualizado' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = em.getReference(Color, id);
    await em.removeAndFlush(color);
    res.status(200).send({ message: 'Color eliminado' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { findAll, findOne, add, update, remove };
