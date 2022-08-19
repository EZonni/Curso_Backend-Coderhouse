// ----- Importación el módulo FS -----

const fs = require("fs");



// ----- Declaración de la clase Contenedor, con su respectivo constructor y métodos -----

class ContenedorCarritos { 
    
    constructor(fileName) {

        this.fileName = fileName;
    };

    save = async (obj) => {
        
        try { 
            
            let data = await fs.promises.readFile( `./utils/${this.fileName}`, "utf-8" );
            let content = JSON.parse(data);

            if (content.length == 0) {
                
                obj.id = 1;
                obj.timestamp = Date.now();
                await fs.promises.writeFile( `./utils/${this.fileName}`, JSON.stringify(new Array(obj)) );
                return obj.id;

            } else {

                // Obtener el ID más alto del arreglo de carritos.
                let maxId = content.reduce((prev, curr) => prev.id > curr.id ? prev : curr );
                // Asignar un ID al nuevo carrito.
                obj.id = maxId.id + 1;
                // Agregar el objeto al arreglo de carritos.
                obj.timestamp = Date.now();
                content.push(obj);
                await fs.promises.writeFile( `./utils/${this.fileName}`, JSON.stringify(content) );
                return obj.id;
            };

        } catch (err) { console.log(err); };
    };

    getById = async (id) => {
        
        try {

            let data = await fs.promises.readFile( `./utils/${this.fileName}`, "utf-8" );
            let content = JSON.parse(data);
            // Filtrar el carrito con el ID indicado.
            let value = content.filter((item) => item.id == id);
            return value;

        } catch (err) { console.log(err); };
    };

    getAll = async () => {
        
        try {
            
            let data = await fs.promises.readFile( `./utils/${this.fileName}`, "utf-8" );
            let content = JSON.parse(data);
            return content;

        } catch (err) { console.log(err); };
    };

    updateProducts = async (id, newProduct) => {

        try {

            let data = await fs.promises.readFile( `./utils/${this.fileName}`, "utf-8" );
            let content = JSON.parse(data);
            // Filtrar el carrito con el ID indicado.
            let carrito = content.find((item) => item.id == id);
            // Agregar el producto nuevo al carrito.
            let producto = {
                "title": newProduct[0].title,
                "price": newProduct[0].price,
                "id": newProduct[0].id,
                "img": newProduct[0].img,
                "description": newProduct[0].description,
                "code": newProduct[0].code,
                "stock": newProduct[0].stock,
                "timestamp": newProduct[0].timestamp
            };
            carrito.productos.push(producto);
            await fs.promises.writeFile( `./utils/${this.fileName}`, JSON.stringify(carrito));

        } catch (err) { console.log(err); };
    };

    deleteById = async (id) => {
        
        try {

            let data = await fs.promises.readFile( `./utils/${this.fileName}`, "utf-8" );
            let content = JSON.parse(data);

            if(content.length > 1) {
            // Filtrar los demás carritos.
            let contentEdited = content.filter((item) => item.id !== id);
            await fs.promises.writeFile( `./utils/${this.fileName}`, JSON.stringify(contentEdited) );

            } else {

                const emptyJSON = [];
                await fs.promises.writeFile( `./utils/${this.fileName}`, JSON.stringify(emptyJSON));
            }
            
        } catch (err) { console.log(err); };
    };

    deleteProdById = async (idCarrito, idProducto) => {

        try {

            let data = await fs.promises.readFile( `./utils/${this.fileName}`, "utf-8" );
            let content = JSON.parse(data);
            // Buscar el carrito con el ID indicado.
            if (content.find((carrito) => carrito.id === idCarrito)) {

                let carrito = content.find((carrito) => carrito.id === idCarrito);
                // Filtramos los demas carritos.
                content = content.filter((carrito) => carrito.id !== idProducto);
                // Filtramos el producto a eliminar.
                if (carrito.productos.find((producto) => producto.id === idProducto)) {
                    
                    let productosActualizados = carrito.productos.filter((producto) => producto.id !== idProducto);
                    // Actualizamos los productos en el carrito.
                    carrito.productos = productosActualizados;
                    
                    await fs.promises.writeFile( `./utils/${this.fileName}`, JSON.stringify(content) );
                    return content;
            
                } else {

                    const alerta = `Producto ID ${idProducto} no encontrado en el carrito ID ${idCarrito}`;
                    return alerta;
                }

            } else { 

                const alerta = `Carrito ID ${idCarrito} no encontrado`;
                return alerta;
            };

        } catch (err) { console.log(err); };
    };
};

module.exports = ContenedorCarritos;