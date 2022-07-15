class Usuario {

    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre
        this.apellido = apellido
        this.libros = libros
        this.mascotas = mascotas

    };

    getFullName() {
        console.log(`Nombre completo: ${this.nombre} ${this.apellido}`);
    };

    addMascota(mascota) {
        this.mascotas.push(mascota);
    };

    countMascotas() {
        console.log(`Cantidad de mascotas: ${this.mascotas.length}`);
    };

    addBook(libro, autor) {
        this.libros.push({nombre: libro, autor: autor});
    };

    getBookNames() {
        console.log(`Libros: ${this.libros.map( (libro) => libro.nombre)}`)
    };

};

// ---------------------------

const usuario1 = new Usuario(

    "Emmanuel",
    "Zonni",
    [{nombre: "Rayuela", autor: "Julio Cortazar"}],
    ["perro"]

);

usuario1.getFullName();
usuario1.addMascota("gato");
usuario1.countMascotas();
usuario1.addBook("El Principito", "Antoine Saint Exupery");
usuario1.getBookNames();


// ---------------------------

console.log(usuario1);