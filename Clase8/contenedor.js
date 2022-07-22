// ----- Importación el módulo FS -----

const fs = require("fs");

// ----- Declaración de la clase Contenedor, con su respectivo constructor y métodos -----

class Contenedor { 
    
    constructor(fileName) {

        this.fileName = fileName;
    };

    save = async (obj) => {
        
        try { 
            
            let data = await fs.promises.readFile( `./${this.fileName}`, "utf-8" );

            if (data.length == 0) {
                
                obj.id = 1;
                await fs.promises.writeFile( `./${this.fileName}`, JSON.stringify(new Array(obj)) );
                return obj.id;

            } else {

                let fileContent = JSON.parse(data);
                // Obtener el ID más alto del arreglo de productos.
                let maxId = fileContent.reduce((prev, curr) => prev.id > curr.id ? prev : curr );
                // Asignar un ID al nuevo producto.
                obj.id = Number(maxId.id) + 1;
                // Agregar el objeto al arreglo de productos.
                fileContent.push(obj);
                await fs.promises.writeFile( `./${this.fileName}`, JSON.stringify(fileContent) );
                return obj.id;
            };

        } catch (err) { console.log(err); };
    };

    update = async (newTitle, newPrice, id) => {

        try {

            let data = await fs.promises.readFile( `./${this.fileName}`, "utf-8" );
            let content = JSON.parse(data);
            // Filtrar el producto con el ID indicado.
            let products = content.filter((item) => item.id !== id);
            // Crear el producto nuevo.
            let productUpdated = {
                "title": newTitle,
                "price": newPrice,
                "id": id
            };
            // Sumar el producto actualizado al arreglo de productos y actualizar el archivo JSON.
            products.push(productUpdated);
            await fs.promises.writeFile( `./${this.fileName}`, JSON.stringify(products) );

        } catch (err) { console.log(err); };
    };

    getById = async (id) => {
        
        try {

            let data = await fs.promises.readFile( `./${this.fileName}`, "utf-8" );
            let content = JSON.parse(data);
            // Filtrar el producto con el ID indicado y mostrarlo en consola.
            let value = content.filter((item) => item.id == id);
            console.log(value);
            return value

        } catch (err) { console.log(err); };
    };

    getAll = async () => {
        
        try {
            
            let data = await fs.promises.readFile( `./${this.fileName}`, "utf-8" );
            let content = JSON.parse(data);
            return content;

        } catch (err) { console.log(err); };
    };

    getLength = async () => {

        try {
            
            let data = await fs.promises.readFile( `./${this.fileName}`, "utf-8" );
            let content = JSON.parse(data);
            return content.length;

        } catch (err) { console.log(err); };
    };

    deleteById = async (id) => {
        
        try {

            let data = await fs.promises.readFile( `./${this.fileName}`, "utf-8" );
            let content = JSON.parse(data);
            // Filtrar los demás productos.
            let contentEdited = content.filter((item) => item.id !== id);
            await fs.promises.writeFile( `./${this.fileName}`, JSON.stringify(contentEdited) );
            console.log(`El producto ${id} ha sido eliminado.`);
            
        } catch (err) { console.log(err); };
    };

    deleteAll = async () => {
        
        try {
            
            await fs.promises.writeFile(`./${this.fileName}`, "");
            console.log("El archivo ahora está vacío.");

        } catch (err) { console.log(err); };
    };
};

module.exports = Contenedor;