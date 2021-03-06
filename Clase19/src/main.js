import dotenv from 'dotenv';
dotenv.config();

import express from  'express'
import handlebars from 'express-handlebars'
import path from 'path'
import Yargs from 'yargs'
import cluster from 'cluster'
import os from 'os'
import session from 'express-session' /** para manejo de sesion */

import { Server as HttpServer } from  'http'
import { Server as Socket } from 'socket.io'

import logger from "../src/logger.js";

//import config from  '../src/options/config.js'

import passport from './auth.js'
import {conectarDB} from './options/conexionBD.js'
import ContenedorMongoD from '../contenedores/ContenedorMongoDb.js'
import {routerProductos} from '../routes/routerProducto.js'
import {routerInfo} from '../routes/routerInfo.js'
import {routerRandom} from '../routes/routerRandom.js'
import {routerRaiz, cargarDatosSesion} from '../routes/routerRaiz.js';
import {cargarProductoRandom, getAllNormalizados} from '../controllers/productos.js';

const parametros = Yargs(process.argv.slice(2))
                      .alias({
                        p: 'puerto',
                        m: 'modo'
                      })
                      .default({
                        puerto: '8080',
                        modo: 'FORK'
                      })
                      .argv

const PORT=parametros.puerto  //ahora por parametro de linea de comando
const MODO=parametros.modo    //parametro de linea de comando

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productos= new ContenedorMongoD('productosEje11')
const mensajes= new ContenedorMongoD('mensajesEje11')

/*-----------------------------------------*/
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
   
app.use(
    session({
      secret: "coderhouse",
      cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 60*10*1000,
      },
      rolling: true,
      resave: true,
      saveUninitialized: false,
  })
);

//--------------------------------------------
// configuro el socket
io.on('connection', async socket => {
  logger.info('Nuevo cliente conectado!');

  // carga inicial de producto
  socket.emit('productos',await productos.getAll())

  // carga inicial de productosRandom
  socket.emit('productosRandom',await cargarProductoRandom(PORT))
  
  // actualizacion de producto
  socket.on('updateProducto', async producto => {
      await productos.save(producto)
      io.sockets.emit('productos', await productos.getAll());
  })

  // carga inicial de mensajes
  socket.emit('mensajes', await getAllNormalizados(mensajes))//  await mensajes.getAll())

  socket.emit('cargarDatosSesion',await cargarDatosSesion())

  // actualizacion de mensajes
  socket.on('updateMensaje', async mensaje => {
      await mensajes.save(mensaje)
      io.sockets.emit('mensajes', await getAllNormalizados())// await mensajes.getAll())
  })
});


//**  Manejador de plantillas */
app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'default',
  layoutDir: "/views/layouts",
}))

app.set('view engine', 'hbs');
app.set('views', path.join(process.cwd(), 'public/views'));

//--------------------------------------------
// agrego middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use(passport.initialize());
app.use(passport.session());
    

/** routers */
app.use('/api',routerProductos)
app.use('/info', routerInfo)
app.use('/api/randoms', routerRandom)
app.use('/', routerRaiz)


conectarDB(
  //"//cadena de conexion a mongo"
  process.env.MONGO_DB_URI,
  (err) => {
    if (err) {
      logger.error("Error en conexi??n de base de datos", err);
      return 
    }
    logger.info("Base de datos conectada...");
  }
);

//--------------------------------------------
// inicio el servidor

/** FORMA ANTERIOR */
//--------------------------------------------
// const server = httpServer.listen(PORT, () => {
//     console.log(`Conectado al puerto ${PORT}`)
// })
// server.on('error', (error) => {
//     console.log('Ocurrio un  error...')
//     console.log(error)
// })

/** FORMA NUEVA */
//--------------------------------------------
// Cargo el server
if(MODO=='CLUSTER' && cluster.isPrimary) {
  const numCPUs = os.cpus().length
  
  logger.info(`N??mero de procesadores: ${numCPUs}`)
  logger.info(`PID MASTER ${process.pid}`)

  for(let i=0; i<numCPUs; i++) {
      cluster.fork()
  }

  cluster.on('exit', worker => {
      logger.info('Worker', worker.process.pid, 'died', new Date().toLocaleString())
      cluster.fork()
  })
}else{
  const server = httpServer.listen(PORT, () => {
    logger.info(`Servidor HTTP escuchando en el puerto ${server.address().port} - PID WORKER ${process.pid}`)
    })
    server.on("error", error => logger.error(`Error en servidor ${error}`))
}
/** */
