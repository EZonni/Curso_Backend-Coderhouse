// ----- Importamos la clase "Contenedor" -----

const Contenedor = require('./fileProductos');

const contenedor = new Contenedor("productos.json");


// ----- Importamos el modulo express y creamos el servidor -----

const express = require('express');
const app = express();

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => {
    console.log(`Error en servidor ${error}`);
});


// ----- Endpoints del puerto 8080 -----  AGREGAR Async, Try y Catch como en fileProducts

app.get('/', (req, res) => {

    const html = `
        <h1> Bienvenidos </h1>
        <button onclick="window.location.href='/productos'"> Productos </button>
        <button onclick="window.location.href='/productoRandom'"> Producto Random </button>
    `;

    res.send(html);
});

app.get('/productos', async (req, res) => {

    let data;

    try {
        data = await contenedor.getAll();
    } catch(err) {
        console.log(err);
    };

    res.send(data);
});

app.get('/productoRandom', async (req, res) => {

    let data;

    try {

        data = await contenedor.getAll();
        data = data[Math.floor(Math.random() * data.length)]

    } catch(err) {

        console.log("error", err);
    };

    res.send(data);
});