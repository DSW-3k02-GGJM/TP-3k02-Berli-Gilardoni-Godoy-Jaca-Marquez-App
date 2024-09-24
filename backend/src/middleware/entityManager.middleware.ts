// src/middleware/entityManager.middleware.ts
// creo este archivo de middleware para instaciar el em y usarlo para el filtro

// obtener una instancia del EntityManager configurado en la aplicación

import { Request, Response, NextFunction } from 'express';
import { MikroORM, EntityManager } from '@mikro-orm/core';
import {MySqlDriver} from "@mikro-orm/mysql";
import {SqlHighlighter} from "@mikro-orm/sql-highlighter";
import {orm} from "../shared/db/orm.js";

export async function attachEntityManager(req: Request, res: Response, next: NextFunction) {
  const orm = await MikroORM.init({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: 'alquilerVehiculos',
    driver: MySqlDriver,
    //clientUrl: 'mysql://dsw:dsw@127.0.0.1:3307/alquilerVehiculos', //Juan Pablo
    //clientUrl: 'mysql://dsw:dsw@localhost:3308/alquilerVehiculos', //Nahuel
    //clientUrl: 'mysql://miUsuario:miContraseña@localhost:3306/alquilerVehiculos',// marcos
    clientUrl: 'mysql://root:root@localhost:3306/alquilervehiculos', //Lucio
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator: {
      // never in production
      disableForeignKeys: true,
      createForeignKeyConstraints: true,
      ignoreSchema: [],
    },
  }); // Asegúrate de que MikroORM está configurado correctamente
  req.em = orm.em.fork(); // Crear un fork del EntityManager para el request actual
  next();
}
