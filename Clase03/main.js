const express = require('express')
const Contenedor = require('./Contenedor.js')

let contenedor= new Contenedor('productos.txt');

const app = express()
const PORT=8080

app.get('/', (req, res) => {
    const auxCadena=`Forma de uso:<br>/productos <br>/productosRandom`    
    res.send(auxCadena)
})

app.get('/productos', async (req, res) => {
    const rta=await contenedor.getAll();
    res.send(rta)
})

app.get('/productosRandom',async(req, res) => {
    const rta=await contenedor.getRandom();
    res.send(rta)
})

const server = app.listen(PORT, () => {
    console.log(`Conectado al puerto ${server.address().port}`)
})
server.on('error', (error) => {
    console.log('Ocurrio un  error...')
    console.log(error)
})