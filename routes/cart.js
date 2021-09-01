var express = require('express');
var DB = require("../db");
var router = express.Router();

/* GET home page. */
router.get('/cart', function(req, res, next) {
  const db = new DB();
  var orders = [];
  //req.session.cart.forEach((key, value) =>{
  const cart = Object.entries(req.session.cart);
  var i = 0;
  for (const [key, value] of cart) {  
      db.getDish(key, (error, results, fields) => {
        if(error) {
          next(error);
          return;
        }

        orders.push({
          id: results[0].id,
          nome: results[0].nome,
          qty: value 
        });
      
        if (i == cart.length - 1)
          res.render('cart', { title: 'Cart', orders});
      });

    i++;
  
  }

  
});

router.post('/cart/submit', function(req, res, next) {
  if(req.session.cart){
    //errore
  }

  const db = new DB();
  
  const tavolo = req.body.tavolo
  if(!tavolo){
    // errore
  }

  var idUtente = null;
  if(req.user.userProfile.id)
    idUtente = req.user.userProfile.id;

  var order = []
  req.session.cart.forEach((idPiatto, qty) => {
    order.push([tavolo, idPiatto, qty, idUtente]);
  });

  db.addOrder(order, (error, results, fields) => {
    if(error) {
      next(error);
      return;
    }
  });    
});

module.exports = router;