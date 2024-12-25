// Express
import { Request } from 'express';

// MikroORM
import { EntityManager } from '@mikro-orm/core';

declare global {
  namespace Express {
    interface Request {
      session?: Record<string, any, null>;
      em: EntityManager;
    }
  }
}
