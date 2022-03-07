import Producto from  "../models/modelProducts.js"

export function asModel(datos) {
  const producto = new Producto(datos);
  return producto;
}

export function asModels(datos) {
  const productos = datos.map((d) => asModel(d));
  return productos;
}

export function asDto(producto) {
  const dto = {
    nombre: producto.nombre,
    precio: producto.precio,
    foto: producto.foto,
  };
  return dto;
}

export function asDtos(productos) {
  const dtos = productos.map(d => asDto(d))
  return dtos
}
