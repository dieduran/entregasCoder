const socket = io();

const formAgregarProductos = document.getElementById("formAgregarProductos")

formAgregarProductos.addEventListener('submit', e => {
    // prevengo que el formulario recargue la pagina al hacer submit
    
    e.preventDefault()

    const producto = {
        title: formAgregarProductos [ 0 ].value, 
        price: formAgregarProductos [ 1 ].value, 
        thumbnail: formAgregarProductos [ 2 ].value, 
    }

    // envio el producto al servidor via socket
    socket.emit('update', producto);

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
