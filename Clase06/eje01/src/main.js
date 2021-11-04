const express= require('express')
const handlebars= require('express-handlebars')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productos = []

//--------------------------------------------
// configuro el socket
io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga inicial de personas
    socket.emit('productos', productos);

    // actualizacion de personas
    socket.on('update', producto => {
        productos.push(producto)
        io.sockets.emit('productos', productos);
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
