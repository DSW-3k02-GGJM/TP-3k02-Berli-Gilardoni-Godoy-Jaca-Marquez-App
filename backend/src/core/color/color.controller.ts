// Express
import { Request, Response } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { Color } from './color.entity.js';
import { Vehicle } from '../vehicle/vehicle.entity.js';

const em = orm.em;

const findAll = async (_req: Request, res: Response) => {
  try {
    const colors = await em.find(Color, {});
    res.status(200).json({
      message: 'Todos los colores han sido encontrados',
      data: colors,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = await em.findOne(Color, { id });
    if (!color) {
      return res.status(404).json({ message: 'Color no encontrado' });
    } else {
      res
        .status(200)
        .json({ message: 'El color ha sido encontrado', data: color });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    em.create(Color, req.body.sanitizedInput);
    await em.flush();
    res
      .status(201)
      .json({ message: 'El color ha sido registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = await em.findOne(Color, { id });
    if (!color) {
      return res.status(404).json({ message: 'Color no encontrado' });
    } else {
      em.assign(color, req.body.sanitizedInput);
      await em.flush();
      res
        .status(200)
        .json({ message: 'El color ha sido actualizado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const color = await em.findOne(Color, { id });
    const colorInUse = await em.findOne(Vehicle, { color: id });
    if (!color) {
      return res.status(404).json({ message: 'Color no encontrado' });
    } else if (colorInUse) {
      return res.status(400).json({
        message:
          'El color no se puede eliminar porque tiene vehículos asociados.',
      });
    } else {
      await em.removeAndFlush(color);
      res
        .status(200)
        .json({ message: 'El color ha sido eliminado exitosamente' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error de conexión' });
  }
};

const verifyColorNameExists = async (req: Request, res: Response) => {
  try {
    const colorName = req.params.colorName.trim();
    const id = Number.parseInt(req.params.id);
    const color = await em.findOneOrFail(Color, { colorName });
    res.status(200).json({ exists: color.id !== id });
  } catch (error) {
    res.status(200).json({ exists: false });
  }
};

export { findAll, findOne, add, update, remove, verifyColorNameExists };
