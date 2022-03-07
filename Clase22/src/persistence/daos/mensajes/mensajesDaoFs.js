import { promises as fs } from "fs";
import logger from  "../../../utils/logger.js"

class MensajesDaoFS {
  constructor(ruta) {
    this.ruta = ruta;
  }
  async listarMensajes() {
    try {
      const objs = await fs.readFile(this.ruta, "utf-8");
      return JSON.parse(objs);
    } catch (error) {
      logger.error(`Error al listar los mensajes: ${error}`)
      return [];
    }
  }

  async insertarMensaje(newMessage) {
    const chats = await this.listarMensajes();
    let content
    if (chats.mensajes.length > 0) {
      chats.mensajes.push(newMessage);
      chats.mensajes[chats.mensajes.length - 1].id = chats.mensajes.length;
      content = JSON.stringify(chats);
    } else {
      chats.mensajes.push(newMessage);
      chats.mensajes[0].id = 1;
      content = JSON.stringify(chats);
    }
    try {
      return await fs.writeFile(this.ruta, content);
    } catch (error) {
      logger.error(`Error al guardar el mensaje: ${error}`);
    }
  }
}

export default MensajesDaoFS;
