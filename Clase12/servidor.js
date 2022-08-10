// ----- Importamos la clase "Contenedor" -----

const Contenedor = require('./controllers/contenedorProductos.js');

const contenedor = new Contenedor('./controllers/productos.json');



// ----- Importamos la clase "Mensajes" -----

const Mensajes = require('./controllers/contenedorMensajes.js');

const mensajes = new Mensajes('./controllers/mensajes.json');



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


// ----- Handlebars -----

/*const hbs = handlebars.create({

    extname: ".hbs",
    defaultLayout: "index.html",
    layoutsDir: __dirname + "/views/layouts",
});


app.engine("hbs", hbs.engine);
app.set("views", "./views");
app.set("view engine", "hbs");*/



// ----- Websockets -----

io.on('connection', async (socket) => {

    console.log("Usuario conectado");
    socket.emit('productos', await contenedor.getAll());

    socket.on('agregarProducto', async (producto) => {

        await contenedor.save(producto);
        io.sockets.emit('productos', await contenedor.getAll());

    });

    socket.emit('mensajes', await mensajes.getAll());

    socket.on('nuevoMensaje', async (mensaje) => {

        await mensajes.save(mensaje);
        io.sockets.emit('mensajes', await mensajes.getAll());
    });
});



// ----- Servidor -----

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => {
    console.log(`Error en servidor ${error}`);
});