const express = require('express')
const routerProductos= require('./router/routerProducto')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/*app.use(express.static('public'));*/

app.set('views', './views');
app.set('view engine', 'ejs');

/** -------------  */
/*  cargo routers*/

app.use('/productos',routerProductos)

/** -------------  */
const PORT=8080
const server = app.listen(PORT, () => {
    console.log(`Conectado al puerto ${server.address().port}`)
})
server.on('error', (error) => {
    console.log('Ocurrio un  error...')
    console.log(error)})