const { Router } = require('express');

const routerProductos = new Router();

let  productos = [];
//let vistaCarga = true; 

/*productos=[
    { "id":1, "title":"Calculadora", "price":"$ 123.45", "thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-128.png" },
    { "id":2, "title":"Escuadra", "price":"$ 234,56", "thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-128.png" },
    { "id":3, "title":"Reloj", "price":"$ 345", "thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/clock-stopwatch-timer-time-128.png" },
]*/

//GET -> carga de productos
routerProductos.get('/', (req, res) => {
    res.render('formulario')
});

//GET -> devuelve todos los productos.
routerProductos.get('/listado', (req, res) => {
    res.render('vistaproductos',{productos})
});

//POST -> recibe y agrega un producto, y redirecciona
routerProductos.post('/', (req, res) => {
    //obtenemos el maximo Id
    let newId= productos.reduce((max, obj) => (obj.id > max ? obj.id : max),0);
    //proximo Id
    newId++;

    const {title='',price='', thumbnail=''}= req.body
    productos.push({id: newId, title, price, thumbnail})
    console.log({id: newId, title, price, thumbnail})
    
    res.render('vistaproductos',{productos})
});

module.exports = routerProductos;