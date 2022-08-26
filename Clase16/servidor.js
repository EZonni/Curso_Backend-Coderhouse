// ----- Importamos el modulo Express, Handlebars y Websockets -----

const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);



// ----- MariaDB -----

const { mariaDB } = require('./options/MariaDB');
const knexMDB = require('knex')(mariaDB);



// ----- SQLite3 -----

const { sqlite3 } = require('./options/SQLite3');
const knexSQL = require('knex')(sqlite3);



// ----- Websockets -----

io.on('connection', async (socket) => {

    try {

    console.log("Usuario conectado");
    socket.emit('productos', await knexMDB('productos').select());

    socket.on('agregarProducto', async (producto) => {

        try {

            await knexMDB('productos').insert(producto);
            io.sockets.emit('productos', await knexMDB('productos').select());

        } catch(err) { console.log(err) };
    });

    socket.emit('mensajes', await knexSQL('mensajes').select());

    socket.on('nuevoMensaje', async (mensaje) => {

        try {
            await knexSQL.insert(mensaje);
            io.sockets.emit('mensajes', await knexSQL('mensajes').select());
        
        } catch(err) { console.log(err) };
    });

    } catch(err) { console.log(err) };

});



// ----- Servidor -----

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => {
    console.log(`Error en servidor ${error}`);
});