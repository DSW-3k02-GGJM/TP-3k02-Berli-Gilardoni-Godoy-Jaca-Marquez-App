import express from 'express';
import { Cliente } from './cliente.js';
const app = express();
app.use(express.json());
const clientes = [
    new Cliente('DNI', '44213356', 'Matias', 'Marquez', '26/02/2024', 'matiasddae@gmail.com', 'Colombres 2145', ['2453243', '3412993525'], 'Argentino')
];
function sanitizedClienteInput(req, res, next) {
    req.body.sanitizedInput = {
        tipoDoc: req.body.tipoDoc,
        nroDoc: req.body.nroDoc,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        fechaNacimiento: req.body.fechaNacimiento,
        mail: req.body.mail,
        domicilio: req.body.domicilio,
        telefonos: req.body.telefonos,
        nacionalidad: req.body.nacionalidad
    };
    // Más validaciones
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
app.get('/api/clientes', (req, res) => {
    res.json({ data: clientes });
});
app.get('/api/clientes/:nroDoc', (req, res) => {
    const cliente = clientes.find((cliente) => cliente.nroDoc === req.params.nroDoc);
    if (!cliente) {
        return res.status(404).send({ message: 'Cliente No Encontrado' });
    }
    res.json({ data: cliente });
});
app.post('/api/clientes', sanitizedClienteInput, (req, res) => {
    const input = req.body.sanitizedInput;
    const cliente = new Cliente(input.tipoDoc, input.nroDoc, input.nombre, input.apellido, input.fechaNacimiento, input.mail, input.domicilio, input.telefonos, input.nacionalidad);
    clientes.push(cliente);
    return res.status(201).send({ message: 'Cliente creado', data: cliente });
});
app.put('/api/clientes/:nroDoc', sanitizedClienteInput, (req, res) => {
    const clienteIdx = clientes.findIndex((cliente) => cliente.nroDoc === req.params.nroDoc);
    if (clienteIdx === -1) {
        return res.status(404).send({ message: 'Cliente No Encontrado' });
    }
    Object.assign(clientes[clienteIdx], req.body.sanitizedInput);
    return res.status(200).send({ message: 'Cliente modificado correctamente', data: clientes[clienteIdx] });
});
app.patch('/api/clientes/:nroDoc', sanitizedClienteInput, (req, res) => {
    const clienteIdx = clientes.findIndex((cliente) => cliente.nroDoc === req.params.nroDoc);
    if (clienteIdx === -1) {
        return res.status(404).send({ message: 'Cliente No Encontrado' });
    }
    Object.assign(clientes[clienteIdx], req.body.sanitizedInput);
    //clientes[clienteIdx] = {...clientes[clienteIdx], ...req.body.sanitizedInput}
    return res.status(200).send({ message: 'Cliente modificado correctamente', data: clientes[clienteIdx] });
});
app.delete('/api/clientes/:nroDoc', (req, res) => {
    const clienteIdx = clientes.findIndex((cliente) => cliente.nroDoc === req.params.nroDoc);
    if (clienteIdx === -1) {
        res.status(404).send({ message: 'Cliente No Encontrado' });
    }
    else {
        clientes.splice(clienteIdx, 1);
        res.status(200).send({ message: 'Cliente borrado correctamente' });
    }
});
app.use((_, res) => {
    return res.status(404).send({ message: 'Recurso no encontrado' });
});
/*
app.use('/', (req, res) => {
    //res.send('<h1>Hola</h1>');
    res.json({ message: '<h1>Hola</h1>'});
});
*/
app.listen(3000, () => {
    console.log("Servidor operando en http//:localhost:3000/"); //Si no aparece con este link probar con 'localhost:8000'
});
//console.log("test!!");
//# sourceMappingURL=app.js.map