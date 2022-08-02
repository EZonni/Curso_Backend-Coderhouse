// ----- Importamos la clase "Contenedor" -----

const Contenedor = require('./contenedor');

const contenedor = new Contenedor("productos.json");



// ----- Importamos el modulo Express, Handlebar y Router -----

const express = require('express');
const handlebars = require("express-handlebars");
const { Router } = express;
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));

const routerProductos = Router();
app.use('/productos', routerProductos);



// ----- Handlebars -----

const hbs = handlebars.create({

    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
});


app.engine("hbs", hbs.engine);
app.set("views", "./views");
app.set("view engine", "hbs");



// ----- Servidor -----

const PORT = 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => {
    console.log(`Error en servidor ${error}`);
});



// ----- Endpoints -----

app.get('/', (req, res) => {

    res.render("main");
});

// GET

routerProductos.get('/', async (req, res) => {

    let data;
    let emptyData;

    try {

        data = await contenedor.getAll();
        length = await contenedor.getLength();
        
        if(length > 0) {

            emptyData = false;

        } else {

            emptyData = true;
        };
        
    } catch(err) { console.log(err); };

    res.render("productos", {data, emptyData});

});


routerProductos.get('/:id', async (req, res) => {

    const id = req.params.id;

    try {

        data = await contenedor.getById(id);

    } catch(err) { console.log("error", err); };

    if (data.length === 0) {

        res.send({"Error": "Producto no encontrado"});

    } else {

        res.send(data);
    };
});

// POST

routerProductos.post('/', async (req, res) => {

    const productoNuevo = req.body;

    try {
       
        await contenedor.save(productoNuevo);

    } catch (error) { console.log(error); };
    
    res.render("main");
});

// PUT

routerProductos.put('/:id', async (req, res) => {

    const id = parseInt(req.params.id);
    const title = req.body.title;
    const price = req.body.price;
    const img = req.body.img;

    try {

        producto = await contenedor.getById(id);

        if (producto.length === 0) {

            res.send({"Error": "Producto no encontrado"});
    
        } else {
            
            await contenedor.update(title, price, id, img)
            res.send(`Producto ID ${id} actualizado`);
        };

    } catch(err) { console.log("error", err); };    
});

// DELETE

routerProductos.delete('/:id', async (req, res) => {

    const id = parseInt(req.params.id);

    try {

        data = await contenedor.getById(id);

        if (data.length === 0) {

            res.send({"Error": "Producto no encontrado"});
    
        } else {
            
            await contenedor.deleteById(id);
            res.send(`Producto ID ${id} eliminado`);
        };

    } catch(err) { console.log("error", err); };
});