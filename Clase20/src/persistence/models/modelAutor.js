export default class Autor {
    #id
    #email
    #nombre
    #apellido
    #edad
    #alias
    #avatar

    constructor({ id, email, nombre, apellido, edad, alias, avatar }) {
        this.id=id
        this.email = email
        this.nombre = nombre
        this.apellido = apellido
        this.edad = edad
        this.alias = alias
        this.avatar = avatar
    }

    get id() { return this.#id }

    set id(id) {
        if (!id) throw new Error('"id" es un campo requerido')
        this.#id = id
    }

    get email() { return this.#email }

    set email(email) {
        if (!email) throw new Error('"email" es un campo requerido')
        this.#email = email
    }

    get nombre() { return this.#nombre }

    set nombre(nombre) {
        if (!nombre) throw new Error('"nombre" es un campo requerido')
        this.#nombre = nombre
    }

    get apellido() { return this.#apellido }

    set apellido(apellido) {
        if (!apellido) throw new Error('"apellido" es un campo requerido')
        this.#apellido = apellido
    }

    get edad() { return this.#edad }

    set edad(edad) {
        if (!edad) throw new Error('"edad" es un campo requerido')
        this.#edad = edad
    }

    get alias() { return this.#alias }

    set alias(alias) {
        if (!alias) throw new Error('"alias" es un campo requerido')
        this.#alias = alias
    }

    get avatar() { return this.#avatar }

    set avatar(avatar) {
        if (!avatar) throw new Error('"avatar" es un campo requerido')
        this.#avatar = avatar
    }
}