import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { categoryRouter } from './category/category.routes.js';
import { colorRouter } from './color/color.routes.js';
import { brandRouter } from './brand/brand.routes.js';
import { vehicleModelRouter } from './vehicleModel/vehicleModel.routes.js';
import { locationRouter } from './location/location.routes.js';
import { reservationRouter } from './reservation/reservation.routes.js';
import { vehicleRouter } from './vehicle/vehicle.routes.js';
import { userRouter } from './user/user.routes.js';
import { AuthService } from './shared/db/auth.service.js';
import dotenv from 'dotenv';
import { ScheduleService } from './shared/db/schedule.service.js';
import { uploadRouter } from './upload/upload.routes.js';

dotenv.config();
const frontendURL =
  (process.env.FRONTEND_DOMAIN || 'http://localhost') +
  (process.env.FRONTEND_PORT || ':4200');
const app = express();
const corsOptions = {
  origin: frontendURL, // Frontend URL
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
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Accept-Language, Accept-Encoding'
  );

  // Usar RequestContext para MikroORM
  RequestContext.create(orm.em, next);
});

app.use('/api/reservations', reservationRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/colors', colorRouter);
app.use('/api/brands', brandRouter);
app.use('/api/vehicleModels', vehicleModelRouter);
app.use('/api/locations', locationRouter);
app.use('/api/vehicles', vehicleRouter);
app.use('/api/users', userRouter);
app.use('/api/upload', uploadRouter);

// Ruta para servir archivos estáticos
app.use(express.static('public'));

app.use((_, res) => {
  console.log('Ruta no encontrada');
  return res.status(404).send({ message: 'Resource not found' });
});

// Sincronización del esquema (evitar en producción)
await syncSchema(); // never in production

const port = process.env.PORT || 3000;
const domain = process.env.DOMAIN || 'http://localhost:';
app.listen(port, () => {
  console.log('Servidor operando en ' + domain + port + '/'); //Si no aparece con este link probar con 'localhost:8000'
  AuthService.ensureAdminExists();
  ScheduleService.startReminders();
});
