const { Router } = require('express');

const routerProductos = new Router();

let  productos = [];

//para pruebas....no es solicitado para el ejercicio
/*productos=[
    { "id":1, "title":"titulo1", "price":"1.1", "thumbnail":"http:\\direccion1.html" },
    { "id":2, "title":"titulo2", "price":"2.2", "thumbnail":"http:\\direccion2.html" },
    { "id":3, "title":"titulo3", "price":"3.3", "thumbnail":"http:\\direccion3.html" },
    { "id":4, "title":"titulo4", "price":"4.4", "thumbnail":"http:\\direccion4.html" },
    { "id":5, "title":"titulo5", "price":"5.5", "thumbnail":"http:\\direccion5.html" },
    { "id":6, "title":"titulo6", "price":"6.6", "thumbnail":"http:\\direccion6.html" },
]*/

//GET '/api/productos' -> devuelve todos los productos.
routerProductos.get('/', (req, res) => {
    res.json(productos);
});

//GET '/api/productos/:id' -> devuelve un producto según su id.
routerProductos.get('/:id', (req, res) => {
    const id=parseInt(req.params.id)
    let salida= productos.find(obj=>(obj.id===id))
    if(!salida){
        return res.json({ error : 'producto no encontrado' })
    }
    return res.json(salida);
});

//POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
routerProductos.post('/', (req, res) => {
    //obtenemos el maximo Id
    let newId= productos.reduce((max, obj) => (obj.id > max ? obj.id : max),0);
    //proximo Id
    newId++;

    const {title='',price='', thumbnail=''}= req.body
    productos.push({id: newId, title, price, thumbnail})
    res.json({id: newId, title, price, thumbnail})
});

//PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
routerProductos.put('/:id', (req, res) => {
    const id=parseInt(req.params.id)
    const {title='',price='', thumbnail=''}= req.body
    let salida= productos.find(obj=>(obj.id===id))
    if(!salida){
        return res.json({ error : 'producto no encontrado' })
    }
    //eliminamos el elemento
    productos.forEach((e,index)=>{
        if(e.id===id){
            productos.splice(index,1)
        }
    });
    //lo agregamos modificado
    productos.push({id: salida.id, title, price, thumbnail})
    return res.json({id: salida.id, title, price, thumbnail})
});

//DELETE '/api/productos/:id' -> elimina un producto según su id.
routerProductos.delete('/:id', (req, res) => {
    const id=parseInt(req.params.id)
    let salida= productos.find(obj=>(obj.id===id))
    if(!salida){
        return res.json({ error : 'producto no encontrado' })
    }
    //eliminamos el elemento
    productos.forEach((e,index)=>{
        if(e.id===id){
            productos.splice(index,1)
        }
    });
    return res.json(salida)
});

module.exports = routerProductos;