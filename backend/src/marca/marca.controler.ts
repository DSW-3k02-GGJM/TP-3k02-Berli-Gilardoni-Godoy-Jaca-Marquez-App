import { Request, Response, NextFunction } from "express"
import { Marca } from "./marca.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

function sanitizedMarcaInput(req: Request, res: Response, next: NextFunction) {
  // 1. Creación del objeto `sanitizedInput` en `req.body`
  req.body.sanitizedInput = {
      nombre: req.body.nombre, // Copia el campo `nombre` del cuerpo de la solicitud
      //alquileres: req.body.alquileres,
      modelos: req.body.modelos, // Copia el campo `modelos` del cuerpo de la solicitud
  };
  // 2. Eliminación de claves indefinidas en `sanitizedInput`
  Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body.sanitizedInput[key] === undefined) {
          delete req.body.sanitizedInput[key]; // Elimina la clave si el valor es `undefined`
      }
  });
  // 3. Llamada al siguiente middleware o controlador
  next();
}

async function findAll(req: Request, res: Response) {
  try {
    // Consulta para encontrar todas las marcas con sus modelos de vehículos
    const marcas = await em.find(Marca, {}, { populate: ['modelos'] });
    res.status(200).json({ message: 'Todas las marcas encontradas', data: marcas });
  } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
 try {
    const id = req.params.id
    const marca = await em.findOneOrFail(Marca, { id }, { populate: ['modelos'] })
    res.status(200).json({ message: 'Marca no encontrada', data: marca }) 
 } catch (error: any) {
    res.status(500).json({ message: error.message })
 }
}

async function add(req: Request, res: Response) {
  try {
    const marca = em.create(Marca, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Marca creada', data: marca })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
 }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const marca = em.getReference(Marca, id)
    em.assign(marca, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'Marca actualizada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const marca = em.getReference(Marca, id)
    await em.removeAndFlush(marca)
    res.status(200).send({ message: 'Marca eliminada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizedMarcaInput, findAll, findOne, add, update, remove }