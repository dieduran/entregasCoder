export default class Mensaje {
    #id
    #author;
    #text;
    #fechahora;

    constructor({ id, author, text, fechahora }) {
        this.id = id;
        this.author = author;
        this.text = text;
        this.fechahora = fechahora;
    }

    get id() { return this.#id }

    set id(id) {
        if (!id) throw new Error('"id" es un campo requerido');
        this.#id = id;
    }

    get author() { return this.#author }

    set author(author) {
        if (!author) throw new Error('"author" es un campo requerido');
        this.#author = author;
    }

    get text() { return this.#text }

    set text(text) {
        if (!text) throw new Error('"text" es un campo requerido');
        this.#text = text;
    }

    get fechahora() { return this.#fechahora }

    set fechahora(fechahora) {
        if (!fechahora) throw new Error('"fechahora" es un campo requerido');
        this.#fechahora = fechahora;
    }
}