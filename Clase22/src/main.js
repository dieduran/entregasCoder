//import dotenv from 'dotenv';
//dotenv.config();

import express from  'express'
import handlebars from 'express-handlebars'
import path from 'path'
import Yargs from 'yargs'
import cluster from 'cluster'
import os from 'os'
import session from 'express-session' /** para manejo de sesion */
import { Server as HttpServer } from  'http'
import { Server as Socket } from 'socket.io'

import logger from "./utils/logger.js";

import {credenciales } from "./config/credenciales.js";
import passport from './controllers/auth.js'
import {conectarDB} from './config/conexionBD.js'
import {routerProductos} from './routes/routerProducto.js'
import {routerInfo} from './routes/routerInfo.js'
import {routerRandom} from './routes/routerRandom.js'
import {routerRaiz, cargarDatosSesion} from './routes/routerRaiz.js';
import {cargarProductoRandom, getAllNormalizados} from './controllers/productos.js';

import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

import ProductosRepo from './persistence/repos/ProductosRepo.js';
import MensajesRepo from './persistence/repos/MensajesRepo.js';

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

const productos= new ProductosRepo();
const mensajes = new MensajesRepo();

//const productos2 = new ProductosRepo(); //solo para ver que utiliza singleton

const schema = buildSchema(`
  input ProductoInput {
    nombre: String,
    precio: Float,
    foto: String
  }
  type Producto {
    id: ID!
    nombre: String,
    precio: Float,
    foto: String
  }
  type Rdo{
    id: Float
  }
  type Query {
    getProductos(campo: String, valor: String): [Producto],
  }
  type Mutation {
    createProducto(datos: ProductoInput): Rdo
  }
`);

//function getProductos({ campo, valor }) {
let getProductos = async ({ campo, valor }) => {  
  const productosTodos = productos.listar();
  logger.info('getProductos GraphQL.')
  if (campo && valor) {
      return productosTodos.filter(p => p[ campo ] == valor);
  } else {
      return productosTodos;
  }
}

//async function  createProducto({ datos }) {
let createProducto = async  ({ datos })=> {
  logger.info('createProducto en GraphQL.')
  const nuevoProducto = await productos.insertar(datos)
  logger.info('nuevoProducto: ', nuevoProducto)
  return {id: nuevoProducto};
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: {
      getProductos,
      createProducto
  },
  graphiql: true,
}));


/*-----------------------------------------*/
//const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
app.use(
    session({
      secret: credenciales.SESSION_SECRET_KEY,
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
  //ANTES....
  //socket.emit('productos',await productos.listar())
  //AHORA CON GRAPHQL...
  socket.emit('productos',await getProductos(''))

  // carga inicial de productosRandom
  socket.emit('productosRandom',await cargarProductoRandom(PORT))
  
  // actualizacion de producto
  socket.on('updateProducto', async producto => {
    //ANTES: 
    //await productos.insertar(producto)
    //AHORA CON GRAPHQL...
    let {nombre,precio,foto}=producto
      let inputDatos = { datos: { nombre, precio, foto}}      
      await createProducto(inputDatos )
      //ANTES...
      //io.sockets.emit('productos', await productos.listar());
      //AHORA CON GRAPHQL...
      io.sockets.emit('productos',await getProductos(''));
  })

  // carga inicial de mensajes
  socket.emit('mensajes', await getAllNormalizados(mensajes))//  await mensajes.getAll())

  socket.emit('cargarDatosSesion',await cargarDatosSesion())

  // actualizacion de mensajes
  socket.on('updateMensaje', async mensaje => {
      await mensajes.insertarMensaje(mensaje)
      io.sockets.emit('mensajes', await getAllNormalizados(mensajes))// await mensajes.getAll())
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
  credenciales.MONGO_DB_URI,
  (err) => {
    if (err) {
      logger.error("Error en conexión de base de datos", err);
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
  
  logger.info(`Número de procesadores: ${numCPUs}`)
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
