import { asDto, asModels, asDtos } from "../mappers/productoMappers.js";
import ProductosDaoFactory from "../daos/productos/index.js";

export default class ProductosRepo {
  constructor() {
    this.dao = ProductosDaoFactory.getDao();
  }

  async listar() {
    let dtos = await this.dao.getAll();
    const productos = asModels(dtos);
    dtos = asDtos(productos);
    return dtos;
  }

  async insertar(productoNuevo) {
    const dto = asDto(productoNuevo);
    return await this.dao.save(dto);
  }
}
