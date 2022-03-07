export default class Producto {
    #nombre
    #precio
    #foto

    constructor({ nombre, precio, foto }) {
        this.nombre = nombre
        this.precio = precio
        this.foto = foto
    }

    get nombre() { return this.#nombre }

    set nombre(nombre) {
        if (!nombre) throw new Error('"nombre" es un campo requerido')
        this.#nombre = nombre
    }

    get precio() { return this.#precio }

    set precio(precio) {
        if (!precio) throw new Error('"precio" es un campo requerido')
        if (isNaN(precio)) throw new Error('"precio" es un campo de caracteres exclusivamente numéricos')
        if (precio < 0) throw new Error('"precio" no puede ser negativo')
        this.#precio = precio
    }

    get foto() { return this.#foto }

    set foto(foto) {
        if (!foto) throw new Error('"foto" es un campo requerido')
        this.#foto = foto
    }
}