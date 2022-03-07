import config from  "../../../config/config.js";

let mensajesDao;

switch (config.OPCION_DATOS) {
  case "filesystem":
    const { default: MensajesDaoFS } = await import("./mensajesDaoFS.js");
    mensajesDao = new MensajesDaoFS(config.fileSystem.path);
  default:
    const { default: MensajesDaoMongoDb } = await import("./mensajesDaoMongoDb.js");
    mensajesDao = new MensajesDaoMongoDb();
}

export default class MensajesDaoFactory {
  static getDao() {
    return mensajesDao;
  }
}