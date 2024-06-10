import express, {NextFunction,Request,Response} from 'express'
import { Cliente } from './cliente/cliente.entity.js'
import { ClienteRepository } from './cliente/cliente.repository.js';
import { clienteRouter } from './cliente/cliente.routes.js';

const app = express();
app.use(express.json())

app.use('/api/clientes', clienteRouter)

app.use((_, res) => {
    return res.status(404).send({message: 'Recurso no encontrado'})
});

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