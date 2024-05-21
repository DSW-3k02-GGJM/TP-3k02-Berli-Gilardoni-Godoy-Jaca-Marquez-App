import express from 'express'

const app = express();

app.use('/', (req, res) => {
    //res.send('<h1>Hola</h1>');
    res.json({ message: '<h1>Hola</h1>'});
});

app.listen(8000, () => {
    console.log("Servidor operando en http//:localhost:8000/"); //Si no aparece con este link probar con 'localhost:8000'
});

//console.log("test!!");