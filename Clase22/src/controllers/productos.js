import fetch from 'node-fetch'
import { normalize, schema } from "normalizr";


/*-----------------------------------------*/
const cargarProductoRandom = async(PORT) =>{
    let rdo
    await fetch(`http://localhost:${PORT}/api/productos-test`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
      .then(json => rdo=json);   
      return rdo
  }
  
  const getAllNormalizados= async(mensajes)=>{//    getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo.
    try{
        const originalData= await mensajes.listar();

        let auxData= new Object({id: 'mensajes', mensajes: originalData})
        const tamanioAntes = JSON.stringify(originalData).length
        const authorSchema = new schema.Entity('author',{idAttribute:"id"});
        const messageSchema = new schema.Entity('mensaje',{
            author: authorSchema})
        const allMessageSchema= new schema.Entity('mensajes',{
            mensajes:[ messageSchema]});
        const normalizedData = normalize(auxData,allMessageSchema);

        const tamanioDespues= JSON.stringify(normalizedData).length
        const dataIntegrada= new Object({antes: tamanioAntes, despues: tamanioDespues, mensajesNormalizado: normalizedData })
        //return normalizedData
        return dataIntegrada
    }catch(error){
        //const contenido = []
        const dataIntegrada= new Object({antes: 0 , despues: 0, mensajesNormalizado: [] })
        return dataIntegrada // JSON.parse(contenido)
    }
  }

export { cargarProductoRandom, getAllNormalizados };