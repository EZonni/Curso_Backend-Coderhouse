// ----- Importación el módulo FS -----

const fs = require("fs");

// ----- Declaración de la clase Mensajes, con su respectivo constructor y métodos -----

class Mensajes {

    constructor(fileName) {

        this.fileName = fileName;
    };

    save = async (msj) => {

        try {

            let data = await fs.promises.readFile(`./${this.fileName}`, "utf-8");

            if (data.length > 0) {

                const mensajes = JSON.parse(data);
                mensajes.push(msj);
                await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(mensajes));

            } else {

                await fs.promises.writeFile( `./${this.fileName}`, JSON.stringify(new Array(msj)) );
            };

        } catch (err) { console.log(err); };
    };

    getAll = async () => {

        try {

            let data = await fs.promises.readFile(`./${this.fileName}`, "utf-8");
            let content = JSON.parse(data);
            return content;

        } catch (err) { console.log(err); };
    };
};

module.exports = Mensajes;