import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Vehiculo } from './vehiculo.entity.js';

const em = orm.em;

const sanitizedVehiculoInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    patente: req.body.patente,
    anioFabricacion: req.body.anioFabricacion,
    kmRecorridos: req.body.kmRecorridos,
    sucursal: req.body.sucursal,
    color: req.body.color,
    modelo: req.body.modelo,
    alquileres: req.body.alquileres,
    //imagenRuta: req.body.imagenRuta, // agregue esto para la imagen (ruta)
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
    const vehiculos = await em.find(
      Vehiculo,
      {},
      {
        populate: [
          'sucursal',
          'color',
          'modelo',
          'modelo.categoria',
          'modelo.marca',
          'alquileres',
          'alquileres.cliente',
        ],
      }
    );
    res
      .status(200)
      .json({ message: 'Todos los vehiculos encontrados', data: vehiculos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehiculo = await em.findOneOrFail(
      Vehiculo,
      { id },
      {
        populate: [
          'sucursal',
          'color',
          'modelo',
          'modelo.categoria',
          'modelo.marca',
          'alquileres',
          'alquileres.cliente',
        ],
      }
    );
    res.status(200).json({ message: 'Vehiculo encontrado', data: vehiculo });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const add = async (req: Request, res: Response) => {
  try {
    const vehiculo = em.create(Vehiculo, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'Vehiculo creado', data: vehiculo });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehiculo = await em.findOneOrFail(Vehiculo, { id });
    em.assign(vehiculo, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'Vehiculo actualizado', data: vehiculo });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const vehiculo = em.getReference(Vehiculo, id);
    await em.removeAndFlush(vehiculo);
    res.status(200).send({ message: 'Vehiculo eliminado' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { sanitizedVehiculoInput, findAll, findOne, add, update, remove };
