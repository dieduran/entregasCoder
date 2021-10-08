const fs = require('fs');

class TipoObjeto {
    constructor (title, price,thumbnail){
        this.title=title,
        this.price=price,
        this.thumbnail=thumbnail
    }
}

class  Contenedor {
    constructor (nombreArchivo){
        this.nombreArchivo=  nombreArchivo;
        this.objetos=[];
        this.proximoId=1
    }

    save(objeto){ //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        const obj= ({title:objeto.title, price:objeto.price, thumbnail:objeto.thumbnail, id: this.proximoId})
        this.objetos.push(obj)
        this.proximoId++;
        this.grabarArchivo();
        return this.proximoId
    }

    getById(id){//getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        let salida=  this.objetos.find( obj=> (obj.id===id))
        if (salida){
            return salida
        }else{
            return null //porque me daba undefined y pedia null
        }
    }

    getAll(){//    getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
        return this.objetos
    }

    deleteById(id){//    deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        for (let i=0; i< this.objetos.length;i++)
        {   
            if(id===this.objetos[i].id){
                this.objetos.splice(i,1) //eliminamos la aparicion, deberia ser la unica
            } 
        }
        this.grabarArchivo();
    }
    deleteAll(){//    deleteAll(): void - Elimina todos los objetos presentes en el archivo.
        this.objetos=[]
        this.proximoId=1 //reiniciamos
        this.grabarArchivo();
    }

    grabarArchivo(){
        try {
            const datosSalida= this.objetos
            fs.writeFileSync(this.nombreArchivo, JSON.stringify(datosSalida, null, 2))
            console.log(`${this.nombreArchivo}: escritura exitosa`)
        } catch (error) {
            throw new Error(`Error en escritura: ${error}`)
        }
    }

    leerArchivo(){
        try {
            if(fs.existsSync(this.nombreArchivo)){
                const contenido = fs.readFileSync(this.nombreArchivo, 'utf-8')
                console.log('Hay datos anteriores')

                this.objetos= JSON.parse(contenido);
                //actualizamos el proximo id, para que actualice el proximoId para las siguientes inserciones
                this.proximoId=1;
                this.objetos.forEach(element => {
                    if(this.proximoId<=element.id){
                        this.proximoId=element.id+1
                    }
                });
            }else{
                //el archivo no existe ..no hacemos nada
                console.log('No hay datos anteriores')
            }            
           
        } catch (error) {
            throw new Error(`Error en lectura: ${error.message}`)
        }
    }
}


let contenedor= new Contenedor('productos.txt');

console.log('------leemos el archivo por si tenes productos de antes')

contenedor.leerArchivo();

console.log('------leemos lo que vino del archivo')
console.log('--getAll')
console.log(contenedor.getAll())

const obj1= new TipoObjeto('Escuadra', 123.45, 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png')
const obj2= new TipoObjeto('Calculadora', 234.56,'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png')          
const obj3= new TipoObjeto('Globo Terráqueo', 345.67, 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png')

console.log('--Contenedor antes')
console.log(contenedor)
console.log('------')
console.log('--Agrego 1er objeto')
contenedor.save(obj1)
console.log('------')
console.log('--Contenedor despues')
console.log(contenedor)
console.log('--Agrego 2do objeto')
contenedor.save(obj2)
console.log('--Agrego 3er objeto')
contenedor.save(obj3)
console.log('--Contenedor despues')
console.log(contenedor)
console.log('------')
console.log('--getById(2)')
console.log(contenedor.getById(2))
console.log('--getById(34) :  debe devolver null')
console.log(contenedor.getById(34))

console.log('------')
console.log('--getAll')
console.log(contenedor.getAll())
console.log('------')
console.log('--deleteById(2)')
console.log(contenedor.deleteById(2))
console.log('------')
console.log('--getAll')
console.log(contenedor.getAll())
console.log('------')
console.log('--deleteAll')
console.log(contenedor.deleteAll()) 
console.log('------')
console.log('--getAll')
console.log(contenedor.getAll())

//Para no dejarlo vacio y el proximo arranque que lea el archivo.. vuelvo agregar el 1
console.log('--Para no dejarlo vacio y el proximo arranque que lea el archivo.. vuelvo agregar el 1')
console.log('--Agrego 1er objeto')
contenedor.save(obj1)
console.log('------')
console.log('--getAll')
console.log(contenedor.getAll())

