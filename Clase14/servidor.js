// ----- Importamos el modulo Express y Handlebar -----

const express = require('express');
const handlebars = require("express-handlebars");
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));



// ----- Handlebars -----

const hbs = handlebars.create({

    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/public/views",
});


app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./public/views");



// ----- Servidor -----

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => {
    console.log(`Error en servidor ${error}`);
});



// ----- Administrador -----

const adm = true;


// ----- Importamos y declaramos la clase contenedora de productos -----

const ContenedorProductos = require("./utils/contenedorProductos");

const contenedorProductos = new ContenedorProductos("productos.json");



// ----- Importamos y declaramos la clase contenedora de productos -----

const ContenedorCarritos = require("./utils/contenedorCarritos");

const contenedorCarritos = new ContenedorCarritos("carritos.json");



// ----- Importamos y aplicamos los routers -----

const routerProductos = require("./routers/routerProductos");
app.use('/productos', routerProductos);

const routerCarritos = require("./routers/routerCarrito");
app.use('/carrito', routerCarritos);



// ----- Endpoints productos -----

// GET

routerProductos.get('/', async (req, res) => {

    let data;
    let emptyData;

    try {

        data = await contenedorProductos.getAll();
        length = await contenedorProductos.getLength();
        
        if(length > 0) {

            emptyData = false;

        } else {

            emptyData = true;
        };
        
    } catch(err) { console.log(err); };

    if (adm == true) {
        
        res.render("productosADM", {data, emptyData});
    
    } else {
       
        res.render("productos", {data, emptyData});
    };

});


routerProductos.get('/:id', async (req, res) => {

    const id = req.params.id;
    let emptyData;

    try {

        data = await contenedorProductos.getById(id);
        length = await contenedorProductos.getLength();

        if(length > 0) {

            emptyData = false;
            
            if (adm == true) {
        
                res.render("productosADM", {data, emptyData});
            
            } else {
               
                res.render("productos", {data, emptyData});
            };

        } else {

            res.send({"Error": "Producto no encontrado"});
        };

    } catch(err) { console.log("error", err); };

});

// POST

routerProductos.post('/', async (req, res) => {

    const productoNuevo = req.body;

    try {
       
        await contenedorProductos.save(productoNuevo);

    } catch (error) { console.log(error); };

    if (adm == true) {

        res.render("productosADM");

    } else {

        res.send({error: -1, descripcion: `${req.path} ${req.method} no esta autorizado`});
    };
    
    
});

// PUT

routerProductos.put('/:id', async (req, res) => {

    const id = parseInt(req.params.id);
    const title = req.body.title;
    const price = req.body.price;
    const img = req.body.img;
    const description = req.body.description;
    const code = req.body.code;
    const stock = req.body.stock;

    try {

        producto = await contenedorProductos.getById(id);

        if (adm == true) {

            if (producto.length === 0) {

                res.send({"Error": "Producto no encontrado"});
        
            } else {
                
                await contenedorProductos.update(title, price, id, img, description, code, stock);
                res.send(`Producto ID ${id} actualizado`);
            };

        } else {

            res.send({error: -1, descripcion: `${req.path} ${req.method} no esta autorizado`});
        };    

    } catch(err) { console.log("error", err); };    
});

// DELETE

routerProductos.delete('/:id', async (req, res) => {

    const id = parseInt(req.params.id);

    try {

        data = await contenedorProductos.getById(id);

        if (adm == true) {

            if (data.length === 0) {

                res.send({"Error": "Producto no encontrado"});
        
            } else {
                
                await contenedorProductos.deleteById(id);
                res.send(`Producto ID ${id} eliminado`);
            };

        } else {

            res.send({error: -1, descripcion: `${req.path} ${req.method} no esta autorizado`});
        }; 

    } catch(err) { console.log("error", err); };
});



// ----- Endpoints carritos -----

// GET

routerCarritos.get('/:id/productos', async (req, res) => {

    const id = req.params.id;
    let emptyData;
    

    try {

       data = await contenedorCarritos.getById(id);

        if (data.length === 0) {

            emptyData = true;
            res.send({"Error": "Carrito no encontrado"});

        } else {

            let productosCarrito = data[0].productos;
            emptyData = false;
            res.render("carrito", {productosCarrito, emptyData});
        };
    
    } catch(err) { console.log("error", err); };
});

// POST

routerCarritos.post('/', async (req, res) => {

    const carritoNuevo = req.body;
    let data;

    try {
       
        data = await contenedorCarritos.save(carritoNuevo);

    } catch (error) { console.log(error); };
    
    res.send(data);
});

routerCarritos.post('/:id/productos/:id_prod', async (req, res) => {

    const idCarrito = req.params.id;
    const idProducto = req.params.id_prod;
    let producto = await contenedorProductos.getById(idProducto);
    let carrito = await contenedorCarritos.getById(idCarrito);

    try {

        if (carrito.length === 0) {

            emptyData = true;
            res.send({"Error": "Carrito no encontrado"});

        } else {

            emptyData = false;
            await contenedorCarritos.updateProducts(idCarrito, producto);
        };

    } catch (error) { console.log(error); };

});

// DELETE

routerCarritos.delete('/:id', async (req, res) => {

    const id = parseInt(req.params.id);

    try {

        data = await contenedorCarritos.getById(id);

        if (data.length === 0) {

            res.send({"Error": "Carrito no encontrado"});
    
        } else {
            
            await contenedorCarritos.deleteById(id);
            res.send(`Carrito ID ${id} eliminado`);
        };

    } catch(err) { console.log("error", err); };
});

routerCarritos.delete('/:id/productos/:id_prod' , async (req, res) => {

    const idCarrito = parseInt(req.params.id);
    const idProducto = parseInt(req.params.id_prod);
    let data;

    try {

        data = await contenedorCarritos.deleteProdById(idCarrito, idProducto);

    } catch (err) { console.log("error", err) };

    res.send(`Producto ID ${idProducto} eliminado del carrito ID ${idCarrito}`);
});