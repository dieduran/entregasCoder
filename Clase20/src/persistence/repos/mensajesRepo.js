import { asDto, asModels, asDtos } from '../mappers/mensajesMapper.js'
import MensajesDaoFactory from "../daos/mensajes/index.js";

export default class MensajesRepo {
  constructor() {
    this.dao = MensajesDaoFactory.getDao();
  }

  async listar() {
    let dtos = await this.dao.getAll()
    const mensajes = asModels(dtos)
    dtos = asDtos(mensajes)
    return dtos
  }

  async insertarMensaje(mensaje) {
    const dto = asDto(mensaje)
    return await this.dao.save(dto)
  }
}
