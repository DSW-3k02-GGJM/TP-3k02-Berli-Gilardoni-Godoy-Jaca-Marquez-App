import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { reservationRouter as reservationRouter } from './alquiler/alquiler.routes.js';
import { categoryRouter as categoryRouter } from './categoria/categoria.routes.js';
import { clienteRouter as clientRouter } from './cliente/cliente.routes.js';
import { colorRouter } from './color/color.routes.js';
import { brandRouter as brandRouter } from './marca/marca.routes.js';
import { modeloRouter as vehicleModelRouter } from './modelo/modelo.routes.js';
import { locationRouter as locationRouter } from './sucursal/sucursal.routes.js';
import { vehicleRouter as vehicleRouter } from './vehiculo/vehiculo.routes.js';
import { usuarioRouter as userRouter } from './usuario/usuario.route.js';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:4200', // Frontend URL
  credentials: true, // Permite credenciales

};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// luego de los middlewares base

app.use((req, res, next) => {
  /*
  Cuando se realiza una solicitud a, por ejemplo, http://localhost:3000/api/vehiculos,
  desde la aplicacion Angular (que está ejecutandose en el puerto 4200), la API no está
  configurada para permitir solicitudes CORS (forma de permitir que un sitio web acceda
  a recursos de otro sitio web desde un navegador), por lo que obtiene HttpErrorResponse
  con un estado de 0 y un error desconocido. Al agregar los siguientes encabezados, será
  posible realizar solicitudes desde cualquier origen.

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Accept-Language, Accept-Encoding'
  );
  */
  RequestContext.create(orm.em, next);
});

// antes de las rutas y middlewares de negocio

app.use('/api/reservations', reservationRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/clients', clientRouter);
app.use('/api/colors', colorRouter);
app.use('/api/brands', brandRouter);
app.use('/api/vehicleModels', vehicleModelRouter);
app.use('/api/locations', locationRouter);
app.use('/api/vehicles', vehicleRouter);
app.use('/api/users', userRouter);

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not' });
});

await syncSchema(); // never in production

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Servidor operando en http://localhost:'+ port + '/'); //Si no aparece con este link probar con 'localhost:8000'
});
