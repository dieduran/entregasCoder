const express= require('express')
const handlebars= require('express-handlebars')

const optionsSQLite = require('./options/SQLite3')
const optionsMariaDB = require('./options/mariaDB')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const ContenedorProductosSQL = require('./ContenedorProductosSQL.js')
const ContenedorMensajesSQL = require('./ContenedorMensajesSQL.js')

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productos = new ContenedorProductosSQL(optionsMariaDB, 'productos')
const mensajes =  new ContenedorMensajesSQL(optionsSQLite,'mensajes') 


const inicializar = async()=>{
    //inicializamos las tablas de ambos servidores
     await mensajes.crearTabla();
     await productos.crearTabla();
}

inicializar();

//--------------------------------------------
// configuro el socket
io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de producto
    socket.emit('productos',await productos.getAll())

    // actualizacion de producto
    socket.on('updateProducto', async producto => {
        await productos.save(producto)
        io.sockets.emit('productos', await productos.getAll());
    })

    // carga inicial de mensajes
    socket.emit('mensajes', await mensajes.getAll())

    // actualizacion de mensajes
    socket.on('updateMensaje', async mensaje => {
        await mensajes.save(mensaje)
        io.sockets.emit('mensajes', await mensajes.getAll())
    })
});

//--------------------------------------------
// agrego middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//**  Manejador de plantillas */
app.engine('hbs', handlebars({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutDir: "/views/layouts",
  }))


app.set('view engine', 'hbs');
app.set('views', "./views");

//--------------------------------------------
// inicio el servidor

const PORT=8080
const server = httpServer.listen(PORT, () => {
    console.log(`Conectado al puerto ${server.address().port}`)
})
server.on('error', (error) => {
    console.log('Ocurrio un  error...')
    console.log(error)
})
