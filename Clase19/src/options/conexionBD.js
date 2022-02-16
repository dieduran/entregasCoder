import mongoose from 'mongoose'

var baseDeDatosConectada = false;

function conectarDB(url, cb) {
  console.log ('paso por funcion en conexionBD')
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
      if(!err) {
        baseDeDatosConectada = true;
      }
      if(cb != null) {
        cb(err);
      }
  });
}

export { conectarDB }