// src/middleware/entityManager.middleware.ts
// creo este archivo de middleware para instaciar el em y usarlo para el filtro
import { EntityManager } from '@mikro-orm/core';
import { Request, Response, NextFunction } from 'express';

// obtener una instancia del EntityManager configurado en la aplicación
export function attachEntityManager(req: Request, res: Response, next: NextFunction) {
  req.em = req.app.get('entityManager'); // Obtén la instancia del EntityManager de la aplicación
  next();
}
