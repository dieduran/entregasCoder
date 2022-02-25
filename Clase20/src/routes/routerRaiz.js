import { Router } from 'express';
import passport  from 'passport'

import {getRegistro, getLoginError, getRegistroError, errorRuteo } from '../controllers/login.js'

const routerRaiz = new Router();

let usuario;

/** funciones */

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
}

const cargarDatosSesion =async()=> {
    return {usuario}
}

//Routers
routerRaiz.get('/',checkAuthentication, (req, res) => {
    usuario =req.user.username
    //res.redirect('principal.html')
    res.render('principal.hbs',{
      active: 'index'
  })
})

routerRaiz.get('/login', (req, res) => {
if (req.isAuthenticated()) { 
  res.redirect("/");
} else {
  res.sendFile("formLogin.html", { root: "./public" });
}
});

routerRaiz.post('/login', 
    passport.authenticate("login", {
    failureRedirect: "/faillogin",
    successRedirect: "/",
    })
);

routerRaiz.get("/signup", getRegistro);

routerRaiz.post("/signup",
passport.authenticate("signup", {
  failureRedirect: "/failsignup",
  successRedirect: "/login",
})
);

routerRaiz.get("/failsignup", getRegistroError);

routerRaiz.get("/faillogin", getLoginError);

routerRaiz.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (!err) {
          usuario= "";
          res.sendFile('formLogout.html',{ root: './public' })
      } else {
          logger.error('Logout ERROR ', err)
          res.send({ status: 'Logout ERROR', body: err })
      }
  })
})

// routerRaiz.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

routerRaiz.get("*", errorRuteo);

export {routerRaiz, cargarDatosSesion}