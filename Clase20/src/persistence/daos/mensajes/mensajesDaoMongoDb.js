import { Timestamp } from 'mongodb'
import ContenedorMongoDb from '../../containers/contenedorMongoDb.js'

class MensajesDaoMongoDb extends ContenedorMongoDb {
  constructor() {
    super('mensajes', {
      author: { type: Object, required: true },
      text: { type: String, required: true },
      fechahora: { type: Timestamp, required: true },
    })
  }
}

export default MensajesDaoMongoDb
