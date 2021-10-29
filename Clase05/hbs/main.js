const express = require('express')
const routerProductos= require('./router/routerProducto')
const handlebars= require('express-handlebars')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.engine('hbs', handlebars({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutDir: "/views/layouts",
  }))
 

app.set('view engine', 'hbs');
app.set('views', "./views");

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