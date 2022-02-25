import Mensaje from '../models/modelMensaje.js'
import Autor from '../models/modelAutor.js'

export function asModel(datos) {
  const author = new Autor(datos.author)
  //const mensaje = new Mensaje({ ...datos, author })
  const mensaje = new Mensaje({ ...datos}, author )
  return mensaje
}

export function asModels(datos) {
  //const array = datos.mensajes
  //const mensajes = array.map(d => asModel(d))
  const mensajes = datos.map(d => asModel(d))
  return mensajes
}

export function asDto(mensaje) {
  const dto = {
    author: {
      id: mensaje.author.id,
      email: mensaje.author.email,
      nombre: mensaje.author.nombre,
      apellido: mensaje.author.apellido,
      edad: mensaje.author.edad,
      alias: mensaje.author.alias,
      avatar: mensaje.author.avatar,
    },
    text: mensaje.text,
    fechahora: mensaje.fechahora,
    id: mensaje.id
  }
  return dto
}
export function asDtos(mensajes) {
  const dtos = mensajes.map(d => asDto(d))
  return dtos
}
