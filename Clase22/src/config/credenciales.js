import dotenv from 'dotenv'

dotenv.config({ path: './src/config/.env' })

const credenciales = {
  MONGO_DB_URI: process.env.MONGO_DB_URI || 'coderhouse',
  NOMBRE_DB: process.env.NOMBRE_DB || 'coderhouse',
  SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY || 'coderhouse',
  OPCION_DATOS: process.env.OPCION_DATOS||'mongodb'

}

export { credenciales }

