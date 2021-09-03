var express = require('express');
var DB = require("../db");
var router = express.Router();

/* GET home page. */
router.get('/cart', function(req, res, next) {
  var orders = [];
  //req.session.cart.forEach((key, value) =>{
  const cart = Object.entries(req.session.cart);
  var i = 0;
  const db = new DB();
  for (const [key, value] of cart) {  
      db.getDish(key, (error, results, fields) => {
        if(error) {
          next(error);
          return;
        }

        orders.push({
          id: results[0].id,
          nome: results[0].NOME,
          qty: value 
        });
      
        if (i == cart.length - 1)
          res.render('cart', { title: 'Cart', orders});
        else
          i++;
      });
  }
});

router.post('/cart/submit', function(req, res, next) {
  if(req.session.cart){
    //errore
  }

  const db = new DB();
  
  const tavolo = parseInt(req.body.tavolo)
  if(!tavolo){
    // errore
  }

  var idUtente = null;
  if(req.user)
    idUtente = req.user.id;

  var order = [];
  const cart = Object.entries(req.session.cart);
  for(const[idPiatto, qty] of cart){
    order.push([tavolo, parseInt(idPiatto), qty, idUtente, req.session.id]);
  }

  db.addOrder(order, (error, results, fields) => {
    if(error) {
      next(error);
      return;
    }
    res.status(200).send();
  });    
});

module.exports = router;