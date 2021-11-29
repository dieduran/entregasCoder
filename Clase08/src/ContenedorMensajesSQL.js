const fs = require('fs')
const knexLib  = require('knex');

class  ContenedorMensajesSQL {
    constructor (options, nombreTabla){
        this.knex= knexLib(options);
        this.nombreTabla= nombreTabla;
    }

    //para el caso que no exista la tabla de mensajes
    crearTabla=async()=> {
        console.log('entramos a crear del SQLite...')
        return this.knex.schema.dropTableIfExists(this.nombreTabla)
          .finally(() => {
            return this.knex.schema.createTable(this.nombreTabla, table => {
              table.increments('id').primary();
              table.string('emisor', 50).notNullable();
              table.string('fechaHora', 10).notNullable();
              table.string('texto', 50).notNullable();
            })
          })
      }
  
    getAll= async()=>{//    getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
        try{
            return await this.knex(this.nombreTabla).select('*')
        }catch(error){
            console.log('error lectura...')
            throw new Error('No se pudo leer el schema');
        }
    }

    save = async(objeto)=>{ //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado.
        try{
            const obj= ({emisor:objeto.emisor, fechaHora:objeto.fechaHora, texto:objeto.texto})

            //  //para probar el eliminar por id
            //  if(objeto.texto==='borrar dos'){
            //      await this.deleteById(2)
            //  }

            // //parar probar el eliminar todos
            // if(objeto.texto==='borrar todos'){
            //     await this.deleteAll()
            // }
            return await this.knex(this.nombreTabla).insert(objeto)
        }catch{
            throw new Error('No se pudo guardar');
        }
    }

    getById= async(id)=> {//getById(Number): Object - Recibe un id y devuelve el objeto con ese id, o null si no está.
        try{
            const salida= await this.knex(this.nombreTabla).select('*').where('id', id)
            if (salida){
                return salida
            }else{
                return null //porque me daba undefined y pedia null
            }
        }catch{
            throw new Error('Error al obtener el Id');
        }
    }

    deleteById= async(id)=>{//    deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
        try{
            return await this.knex.from(this.nombreTabla).where('id', id).del()
        }catch{
            throw new Error('Error al obtener al borrar el Id');
        }
    }

    deleteAll= async()=>{//    deleteAll(): void - Elimina todos los objetos presentes en el archivo.
        try{
            return await this.knex.from('mensajes').del();
        } catch(error){
            throw new Error('Error al obtener al borrar todos los objetos');
        }
    }
}

module.exports = ContenedorMensajesSQL;
