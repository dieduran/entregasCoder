import { asDto, asModels, asDtos } from '../mappers/mensajesMapper.js'
import MensajesDaoFactory from "../daos/mensajes/index.js";
import logger from "../../utils/logger.js";

export default class MensajesRepo {
  static instancia
  constructor() {
    if (!MensajesRepo.instancia){
      logger.info('MensajesRepo primera vez');
      this.dao = MensajesDaoFactory.getDao();
      MensajesRepo.instancia= this
    }else{
      logger.info('MensajesRepo otras veces')
      return MensajesRepo.instancia
    }
  }

  //   //antes....
  // constructor() {
  //   this.dao = MensajesDaoFactory.getDao();
  // }

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
