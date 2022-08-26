const { sqlite3 } = require('../options/SQLite3');
const knex = require('knex')(sqlite3);

knex.schema.createTable('mensajes', table => {

    table.string('usuario'),
    table.date('fecha'),
    table.string('mensaje')
})
    .then(() => console.log("Tabla de mensajes creada"))
    .catch((err) => { console.log(err) })
    .finally(() => {
        knex.destroy();
    });