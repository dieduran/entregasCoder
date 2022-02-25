import config from  "../../../config/config.js" //"../../../options/config.js";

let productosDao;

switch (config.OPCION_DATOS) {
  default:
    const { default: ProductosDaoMongoDb } = await import("./ProductosDaoMongoDb.js");
    productosDao = new ProductosDaoMongoDb();
    await productosDao.conectar();
}

export default class ProductosDaoFactory {
  static getDao() {
    return productosDao;
  }
}
