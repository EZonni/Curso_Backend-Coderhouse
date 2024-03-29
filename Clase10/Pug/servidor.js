// ----- Importamos la clase "Contenedor" -----

const Contenedor = require('./contenedor');

const contenedor = new Contenedor("productos.json");



// ----- Importamos el modulo Express, PUG y Router -----

const express = require('express');
const pug = require('pug');
const { Router } = express;
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));

const routerProductos = Router();
app.use('/productos', routerProductos);



// ----- PUG -----

app.set("views", "./views");
app.set("view engine", "pug");



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

    res.render("index");
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
    
    res.render("index");
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