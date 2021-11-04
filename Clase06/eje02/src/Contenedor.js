const fs = require('fs')

class  Contenedor {
    constructor (nombreArchivo){
        this.nombreArchivo=  nombreArchivo;
    }

    getAll= async()=>{//    getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
        try{
            const contenido = await fs.promises.readFile(this.nombreArchivo, 'utf-8')
            return JSON.parse(contenido)
        }catch(error){
            console.log('error lectura...')
            await fs.promises.writeFile(this.nombreArchivo,JSON.stringify([], null, 2))
            const contenido = await fs.promises.readFile(this.nombreArchivo, 'utf-8')
            return JSON.parse(contenido)
        }
    }

    save = async(objeto)=>{ //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        const arrObjetos= await this.getAll();
        let maxId = 0;
        arrObjetos.forEach(valor => {
                if (valor.id > maxId) {
                    maxId = valor.id;}
            }
        );
        maxId+=1; //usamos el siguiente id

        const obj= ({emisor:objeto.emisor, fechaHora:objeto.fechaHora, texto:objeto.texto, id: maxId})
        arrObjetos.push(obj)
        try{
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(arrObjetos, null, 2))
            return obj.id;
        }catch{
            throw new Error('No se pudo guardar');
        }
    }

    getById= async(id)=> {//getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.

        try{
            const arrObjetos= await this.getAll();
            let salida=  arrObjetos.find( obj=> (obj.id===id))
            if (salida){
                return salida
            }else{
                return null //porque me daba undefined y pedia null
            }
        }catch{
            throw new Error('Error al obtener el Id');
        }
    }

    getRandom= async()=> {//getRandom(): Object - Devuelve un objeto random.
        const arrObjetos= await this.getAll();
        let maxId = 0;
        let auxAleatorio; 
        arrObjetos.forEach(valor => {
                if (valor.id > maxId) {
                    maxId = valor.id;}
            }
        );
        auxAleatorio= parseInt(Math.random() * maxId) + 1
        try{
            const arrObjetos= await this.getAll();
            let salida=  arrObjetos.find( obj=> (obj.id===auxAleatorio))
            if (salida){
                return salida
            }else{
                return null //porque me daba undefined y pedia null
            }
        }catch{
            throw new Error('Error al obtener el producto aleatorio');
        }
    }


    deleteById= async(id)=>{//    deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        try{
            const arrObjetos= await this.getAll();
            for (let i=0; i< arrObjetos.length;i++)
            {   
                if(id===arrObjetos[i].id){
                    arrObjetos.splice(i,1) //eliminamos la aparicion, deberia ser la unica
                } 
            }
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(arrObjetos, null, 2))
        }catch{
            throw new Error('Error al obtener al borrar el Id');
        }
    }

    deleteAll= async()=>{//    deleteAll(): void - Elimina todos los objetos presentes en el archivo.
        try{
            await fs.promises.writeFile(this.nombreArchivo,JSON.stringify([], null, 2))
        } catch(error){
            throw new Error('Error al obtener al borrar todos los objetos');
        }
    }
}

module.exports= Contenedor;
