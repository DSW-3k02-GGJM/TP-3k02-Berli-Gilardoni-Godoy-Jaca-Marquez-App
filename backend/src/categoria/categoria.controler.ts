import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Categoria } from './categoria.entity.js';

const em = orm.em;

const sanitizedCategoriaInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    precioPorDia: req.body.precioPorDia,
    valorDeposito: req.body.valorDeposito,
    modelos: req.body.modelos,
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
    const categorias = await em.find(
      Categoria,
      {},
      {
        populate: [
          'modelos',
          'modelos.marca',
          'modelos.vehiculos',
          'modelos.vehiculos.color',
          'modelos.vehiculos.sucursal',
          'modelos.vehiculos.alquileres',
          'modelos.vehiculos.alquileres.cliente',
        ],
      }
    );
    res
      .status(200)
      .json({ message: 'Todas las categorias encontradas', data: categorias });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = await em.findOneOrFail(
      Categoria,
      { id },
      {
        populate: [
          'modelos',
          'modelos.marca',
          'modelos.vehiculos',
          'modelos.vehiculos.color',
          'modelos.vehiculos.sucursal',
          'modelos.vehiculos.alquileres',
          'modelos.vehiculos.alquileres.cliente',
        ],
      }
    );
    res.status(200).json({ message: 'Categoria encontrada', data: categoria });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const categoria = em.create(Categoria, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'Categoria creada', data: categoria });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = await em.findOneOrFail(Categoria, { id });
    em.assign(categoria, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'Categoria actualizada', data: categoria });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const categoria = em.getReference(Categoria, id);
    await em.removeAndFlush(categoria);
    res.status(200).send({ message: 'Categoria eliminada' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { sanitizedCategoriaInput, findAll, findOne, add, update, remove };
