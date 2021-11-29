const socket = io();

Handlebars.registerHelper('formatDate', function(date) {
    return new Handlebars.SafeString(
        new Date(date).toLocaleString()
    );
});

const formAgregarProductos = document.getElementById("formAgregarProductos")
const formAgregarMensajes = document.getElementById("formAgregarMensajes")

formAgregarProductos.addEventListener('submit', e => {
    // prevengo que el formulario recargue la pagina al hacer submit
    
    e.preventDefault()

    const producto = {
        title: formAgregarProductos [ 0 ].value, 
        price: formAgregarProductos [ 1 ].value, 
        thumbnail: formAgregarProductos [ 2 ].value, 
    }

    // envio el producto al servidor via socket
    socket.emit('updateProducto', producto);

    // limpio el contenido de los campos del formulario
    formAgregarProductos.reset()
})

// agrego manejador de eventos de tipo 'productos'
 socket.on('productos', manejarEventoProductos);
 
async function manejarEventoProductos(productos) {

    // busco la plantilla del servidor
    const recursoRemoto = await fetch('views/tabla-productos.hbs')

    //extraigo el texto de la respuesta del servidor
    const textoPlantilla = await recursoRemoto.text()

    //armo el template con handlebars
    const functionTemplate = Handlebars.compile(textoPlantilla)

    // relleno la plantilla con las personas recibidas
    const html = functionTemplate({ productos })

    // reemplazo el contenido del navegador con los nuevos datos
    document.getElementById('productos').innerHTML = html
}


formAgregarMensajes.addEventListener('submit', e => {
    // prevengo que el formulario recargue la pagina al hacer submit
    
    e.preventDefault()
    console.log(formAgregarMensajes [ 0 ].value)
    const mensaje = {
        emisor: formAgregarMensajes [ 0 ].value, 
        fechaHora: new Date(), 
        texto: formAgregarMensajes [ 1 ].value, 
    }

    // envio el producto al servidor via socket
    socket.emit('updateMensaje', mensaje);

    // limpio el contenido de los campos del formulario
    //formAgregarMensajes.reset()
    formAgregarMensajes["nuevoMensaje"].value=""
})
// agrego manejador de eventos de tipo 'mensajes'
socket.on('mensajes', manejarEventoMensajes);
 
async function manejarEventoMensajes(mensajes) {

    // busco la plantilla del servidor
    const recursoRemoto = await fetch('views/tabla-mensajes.hbs')

    //extraigo el texto de la respuesta del servidor
    const textoPlantilla = await recursoRemoto.text()

    //armo el template con handlebars
    const functionTemplate = Handlebars.compile(textoPlantilla)

    // relleno la plantilla con las personas recibidas
    const html = functionTemplate({ mensajes })

    // reemplazo el contenido del navegador con los nuevos datos
    document.getElementById('mensajes').innerHTML = html
}
