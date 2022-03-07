import { asDto, asModels, asDtos } from "../mappers/productoMappers.js";
import ProductosDaoFactory from "../daos/productos/index.js";
import logger from "../../utils/logger.js";

export default class ProductosRepo {
  static instancia
  constructor() {
    if (!ProductosRepo.instancia){
      logger.info('ProductosRepo primera vez');
      this.dao = ProductosDaoFactory.getDao();
      ProductosRepo.instancia= this
    }else{
      logger.info('ProductosRepo otras veces')
      return ProductosRepo.instancia
    }
  }

//   //antes....
//  constructor() {
//   console.log('ProductosRepo primera vez')
//     this.dao = ProductosDaoFactory.getDao();
//   }


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
