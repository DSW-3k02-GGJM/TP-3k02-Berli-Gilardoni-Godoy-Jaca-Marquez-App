import { EntityManager } from '@mikro-orm/core';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      session?: Record<string,any,null>
      em?: EntityManager; // Agrega la propiedad `em` opcionalmente
    }
  }
}
