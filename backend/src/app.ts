import express from 'express'
import { Cliente } from './cliente.js';

const app = express();

const clientes = [
    new Cliente(
        'DNI',
        '44213356',
        'Matias',
        'Marquez',
        '26/02/2024',
        'matiasddae@gmail.com',
        'Colombres 2145',
        ['2453243','3412993525'],
        'Argentino'
    )
]

app.get('/api/clientes',(req,res)=>{
    res.json(clientes)
})

app.get('/api/clientes/:id',(req,res)=>{
    const cliente = clientes.find((cliente) => cliente.id === req.params.id)
    if(!cliente){
        res.status(404).send({message:'Cliente No Encontrado'})
    }
    res.json(cliente)
})


app.use('/', (req, res) => {
    //res.send('<h1>Hola</h1>');
    res.json({ message: '<h1>Hola</h1>'});
});


app.listen(8000, () => {
    console.log("Servidor operando en http//:localhost:8000/"); //Si no aparece con este link probar con 'localhost:8000'
});

//console.log("test!!");