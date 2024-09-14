/*import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { categoryRouter } from "./category/category.routes.js";
import { clientRouter } from './client/client.routes.js';
import { colorRouter } from './color/color.routes.js';
import { brandRouter } from './brand/brand.routes.js';
import { vehicleModelRouter } from './vehicleModel/vehicleModel.routes.js';
import { locationRouter } from './location/location.routes.js';
import { reservationRouter  } from './reservation/reservation.routes.js';
import { vehicleRouter } from './vehicle/vehicle.routes.js';
import { userRouter } from './user/user.routes.js';
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
  // aaaaaaaaaa cerrar aca el comentario
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
*/

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
import { vehicleModelRouter } from './vehicleModel/vehicleModel.routes.js';
import { locationRouter } from './location/location.routes.js';
import { reservationRouter } from './reservation/reservation.routes.js';
import { vehicleRouter } from './vehicle/vehicle.routes.js';
import { userRouter } from './user/user.routes.js';
import dotenv from 'dotenv';
import mysql from 'mysql';
// nuevas
import { MikroORM } from '@mikro-orm/core';
import { attachEntityManager } from './middleware/entityManager.middleware';


dotenv.config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:4200', // Frontend URL
  credentials: true, // Permite credenciales
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Configuración de la conexión a la base de datos
//clientUrl: 'mysql://miUsuario:miContraseña@localhost:3306/alquilerVehiculos',// marcos
const connection = mysql.createConnection({
  host: 'localhost',
  //port: '3306',
  user: 'miUsuario',
  password: 'miContraseña',
  database: 'alquilerVehiculos'
});

connection.connect((err: any) => {
  if (err) throw err;
  console.log('Conexión a la base de datos exitosa.');
});

app.use((req, res, next) => {
  RequestContext.create(orm.em, next);
});

// Agregar el endpoint para vehículos disponibles
app.get('/api/vehicleModels/available', (req, res) => {
  const { fechaDesde, fechaHasta } = req.query;

  /*
  const query = `
    SELECT vm.*
    FROM vehicle_model vm
    JOIN vehicle v ON vm.id = v.vehicle_model_id
    LEFT JOIN reservation r ON v.id = r.vehicle_id
    WHERE (
      r.start_date IS NULL 
      OR r.planned_end_date < ? 
      OR r.start_date > ?
    )
    GROUP BY vm.id
    HAVING COUNT(v.id) > 0;
  `;
  */
 const query = 'select vm.* from vehicle_model vm;';

  connection.query(query, [fechaDesde, fechaHasta], (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
      res.status(500).json({ error: 'Error en la consulta' });
    } else {
      res.json({ data: results });
    }
  });
});

// nuevoooooo
//const app = express();

// Configuración de MikroORM
async function initializeDatabase() {
  const orm = await MikroORM.init({
    // Configuración de MikroORM aquí
  });

  // Obtén el EntityManager de MikroORM
  const em = orm.em;

  // Configura el EntityManager en la aplicación Express
  app.set('entityManager', em);
}

initializeDatabase().catch(err => {
  console.error('Error initializing database:', err);
  process.exit(1);
});

// Usa el middleware para inyectar el EntityManager
app.use(attachEntityManager);



// Rutas existentes
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
  return res.status(404).send({ message: 'Resource not found' });
});

await syncSchema(); // nunca en producción

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Servidor operando en http://localhost:' + port + '/'); // Si no aparece con este link probar con 'localhost:8000'
});


// Rutas y otros middlewares
// ...

export default app;