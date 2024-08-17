import 'reflect-metadata';
import express from 'express';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { alquilerRouter } from './alquiler/alquiler.routes.js';
import { categoriaRouter } from './categoria/categoria.routes.js';
import { clienteRouter } from './cliente/cliente.routes.js';
import { colorRouter } from './color/color.routes.js';
import { marcaRouter } from './marca/marca.routes.js';
import { modeloRouter } from './modelo/modelo.routes.js';
import { sucursalRouter } from './sucursal/sucursal.routes.js';
import { vehiculoRouter } from './vehiculo/vehiculo.routes.js';
import { usuarioRouter } from './usuario/usuario.route.js';

const app = express();
app.use(express.json());

// luego de los middlewares base
app.use((req, res, next) => {
  /*
  Cuando se realiza una solicitud a, por ejemplo, http://localhost:3000/api/vehiculos,
  desde la aplicacion Angular (que está ejecutandose en el puerto 4200), la API no está
  configurada para permitir solicitudes CORS (forma de permitir que un sitio web acceda
  a recursos de otro sitio web desde un navegador), por lo que obtiene HttpErrorResponse
  con un estado de 0 y un error desconocido. Al agregar los siguientes encabezados, será
  posible realizar solicitudes desde cualquier origen.
  */
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Accept-Language, Accept-Encoding'
  );
  RequestContext.create(orm.em, next);
});
// antes de las rutas y middlewares de negocio

app.use('/api/alquileres', alquilerRouter);
app.use('/api/categorias', categoriaRouter);
app.use('/api/clientes', clienteRouter);
app.use('/api/colores', colorRouter);
app.use('/api/marcas', marcaRouter);
app.use('/api/modelos', modeloRouter);
app.use('/api/sucursales', sucursalRouter);
app.use('/api/vehiculos', vehiculoRouter);
app.use('/api/usuarios', usuarioRouter);

app.use((_, res) => {
  return res.status(404).send({ message: 'Recurso no encontrado' });
});

await syncSchema(); // never in production

app.listen(3000, () => {
  console.log('Servidor operando en http://localhost:3000/'); //Si no aparece con este link probar con 'localhost:8000'
});
