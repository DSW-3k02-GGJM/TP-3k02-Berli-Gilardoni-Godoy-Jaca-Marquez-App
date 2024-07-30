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

const app = express();
app.use(express.json());

// luego de los middlewares base
app.use((req, res, next) => {
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

app.use((_, res) => {
  return res.status(404).send({ message: 'Recurso no encontrado' });
});

await syncSchema(); // never in production

app.listen(3000, () => {
  console.log('Servidor operando en http://localhost:3000/'); //Si no aparece con este link probar con 'localhost:8000'
});
