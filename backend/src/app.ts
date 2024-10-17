import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { categoryRouter } from "./category/category.routes.js";
import { clientRouter } from './client/client.routes.js';
import { colorRouter } from './color/color.routes.js';
import { brandRouter } from './brand/brand.routes.js';
import { vehicleModelRouter } from './vehicleModel/vehicleModel.routes.js'; // Aquí ya tienes el router
import { locationRouter } from './location/location.routes.js';
import { reservationRouter  } from './reservation/reservation.routes.js';
import { vehicleRouter } from './vehicle/vehicle.routes.js';
import { userRouter } from './user/user.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:4200', // Frontend URL
  credentials: true, // Permite credenciales
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Luego de los middlewares base
app.use((req, res, next) => {
  // Configurar los encabezados CORS si es necesario
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Accept-Language, Accept-Encoding');
  
  // Usar RequestContext para MikroORM
  RequestContext.create(orm.em, next);
});

// Registrar las rutas de negocio
app.use('/api/reservations', reservationRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/clients', clientRouter);
app.use('/api/colors', colorRouter);
app.use('/api/brands', brandRouter);
app.use('/api/vehicleModels', vehicleModelRouter); // Registrar la ruta de vehicleModels
app.use('/api/locations', locationRouter);
app.use('/api/vehicles', vehicleRouter);
app.use('/api/users', userRouter);

// Manejo de errores 404
app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' });
});

// Sincronización del esquema (evitar en producción)
await syncSchema(); // never in production

// Iniciar servidor en el puerto especificado
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Servidor operando en http://localhost:' + port + '/'); // Verifica con este link
});
