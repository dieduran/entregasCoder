const Contenedor = require('./entregaClase02.js')

let contenedor= new Contenedor('productos.txt');

const test = async()=>{
    console.log('------leemos el archivo por si tenes productos de antes')
    console.log(await contenedor.getAll()); //antes de agregar

    console.log('------agregamos productos')
    
    const obj1= {title: 'Escuadra', price: 123.45, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png'}
    console.log(await contenedor.save(obj1));
    const obj2= {title: 'Calculadora', price: 234.56, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png'}          
    console.log(await contenedor.save(obj2));
    const obj3= {title: 'Globo Terráqueo', price: 345.67, thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png'}
    console.log(await contenedor.save(obj3));
    console.log('---------')
    console.log('----Contenedor despues')
    console.log(await contenedor.getAll()); 
    
    console.log('---------')
    console.log('--getById(2)') //buscamos existente
    console.log(await contenedor.getById(2))
    console.log('--getById(34) :  debe devolver null') //buscamos no existente
    console.log(await contenedor.getById(34))
    
    console.log('---------')
    console.log('----Contenedor Antes')
    console.log(await contenedor.getAll()); 
    console.log('------')
    console.log('--deleteById(2)')
    console.log(await contenedor.deleteById(2))
    console.log('----Contenedor despues')
    console.log(await contenedor.getAll())
    
    console.log('---------')
    console.log('--deleteAll')
    console.log(await contenedor.deleteAll()) 
    console.log('---------')
    console.log('--getAll')
    console.log(await contenedor.getAll())  //falta el await
}

test();

