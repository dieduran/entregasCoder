import { credenciales } from "./credenciales.js"

const OPCION_DATOS =  'mongodb'

export default {
    OPCION_DATOS,
    fileSystem: {
        path: './DB'
    },
    mongodb: {
        uri: credenciales.MONGO_DB_URI,
        nombreDb: credenciales.NOMBRE_DB,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            serverSelectionTimeoutMS: 5000
        }
    }
}




