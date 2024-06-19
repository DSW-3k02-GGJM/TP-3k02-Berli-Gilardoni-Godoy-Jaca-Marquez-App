import 'reflect-metadata';
import express from 'express';
import { clienteRouter } from './cliente/cliente.routes.js';
import { orm, syncSchema } from './shared/db/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { vehiculoRouter } from './vehiculo/vehiculo.routes.js';
import { vehiculoModeloRouter } from './vehiculo/vehiculoModelo.routes.js';
const app = express();
app.use(express.json());
//luego de los middlewares base
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
//antes de las rutas y middlewares de negocio
app.use('/api/clientes', clienteRouter);
app.use('/api/vehiculos', vehiculoRouter);
app.use('/api/vehiculos/modelos', vehiculoModeloRouter);
app.use((_, res) => {
    return res.status(404).send({ message: 'Recurso no encontrado' });
});
await syncSchema(); //never in production
app.listen(3000, () => {
    console.log("Servidor operando en http//:localhost:3000/"); //Si no aparece con este link probar con 'localhost:8000'
});
//console.log("test!!");
/*
app.use('/', (req, res) => {
    //res.send('<h1>Hola</h1>');
    res.json({ message: '<h1>Hola</h1>'});
});
*/ 
//# sourceMappingURL=app.js.map