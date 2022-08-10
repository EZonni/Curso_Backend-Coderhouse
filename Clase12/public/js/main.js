// ----- Cliente Websocket -----

const socket = io().connect();



// Productos

const listadoProductos = async (productos) => {

    const res = await fetch('../views/productos.hbs');
    const view = await res.text();
    const template = Handlebars.compile(view);
    const htmlProductos = template({producto: productos});
    return htmlProductos;
};

socket.on('productos', (productos) => {

    listadoProductos(productos).then((html) => {

        document.getElementById('listaProductos').innerHTML = htmlProductos;
    });
});

const nuevoProducto = document.querySelector('#ingresarProducto');

nuevoProducto.addEventListener('submit', (e) => {

    e.preventDefault();
    
    const producto = {

        title: nuevoProducto.children.title.value,
        price: nuevoProducto.children.price.value,
        img: nuevoProducto.children.img.value
    };
    
    socket.emit('agregarProducto', producto);
    nuevoProducto.reset();
});



// Chat

const chat = document.querySelector('#enviarMensaje');

chat.addEventListener('submit', (e) => {

    e.preventDefault();
    
    const mensaje = {

        usuario: document.querySelector('#usuario').value,
        fecha: new Date().toLocaleString(),
        mensaje: document.querySelector('#mensaje').value
    };

    socket.emit('nuevoMensaje', mensaje);
    document.querySelector('#mensaje').value = '';
});

const render = (data) =>{

    if (data) {

        const html = data
            .map((msj) => {

                return `<p style="margin: 25px;">
                            <span >${msj.usuario}</span> <span>[${msj.fecha}]</span> <span>: ${msj.mensaje}</span>
                        </p>`
            })
            .join('');
        document.querySelector('#listaMensajes').innerHTML = html;

    } else {

        document.querySelector('#listaMensajes').innerHTML = `<h4 style="margin: 25px;">No hay mensajes previos</h4>`
    };
};

socket.on('mensajes', (data) => render(data));