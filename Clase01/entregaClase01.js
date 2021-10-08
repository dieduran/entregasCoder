// Entrega Clase 01
class Usuario {
    constructor (nombre, apellido){
        this.nombre= nombre;
        this.apellido= apellido;
        this.libros=[]
        this.mascotas=[]
    }


    getFullName(){
        return (`${this.nombre} ${this.apellido}`)
    }

    addMascota( nombreMascota ){
        this.mascotas.push(nombreMascota)
    }

    countMascotas(){
        if(this.mascotas!=0){
            return this.mascotas.length
        }
        return 0
    }

    addBook (nombre, autor) {
        const tipoLibro = {
            nombre,
            autor
        }
        this.libros.push(tipoLibro)
    }

    getBookNames(){
        return this.libros.map(lib=> lib.nombre)
    }

}

const usuario = new Usuario('Elon', 'Musk');

console.log('Nombre: ')
console.log(usuario.nombre)
console.log('Apellido: ')
console.log(usuario.apellido)
console.log('getFullName(): ')
console.log(usuario.getFullName())

console.log('------------------')
console.log('countMascotas(): ')
console.log(usuario.countMascotas())
usuario.addMascota('teo');
console.log('countMascotas(): ')
console.log(usuario.countMascotas())
usuario.addMascota('tita');
console.log('countMascotas(): ')
console.log(usuario.countMascotas())

console.log('------------------')
console.log('getBookNames(): ')
console.log(usuario.getBookNames())

usuario.addBook('El señor de las moscas','William Golding')
console.log('getBookNames(): ')
console.log(usuario.getBookNames())

usuario.addBook('Fundacion','Isaac Asimov')
console.log('getBookNames(): ')
console.log(usuario.getBookNames())

