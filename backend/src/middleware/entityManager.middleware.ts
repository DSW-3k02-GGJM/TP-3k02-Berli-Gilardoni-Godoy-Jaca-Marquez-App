// src/middleware/entityManager.middleware.ts
// creo este archivo de middleware para instaciar el em y usarlo para el filtro

// obtener una instancia del EntityManager configurado en la aplicación

import { Request, Response, NextFunction } from 'express';
import { MikroORM, EntityManager } from '@mikro-orm/core';

export async function attachEntityManager(req: Request, res: Response, next: NextFunction) {
  const orm = await MikroORM.init(); // Asegúrate de que MikroORM está configurado correctamente
  req.em = orm.em.fork(); // Crear un fork del EntityManager para el request actual
  next();
}
