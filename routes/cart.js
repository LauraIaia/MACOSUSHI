var express = require('express');
var DB = require("../db");
var router = express.Router();

/* GET home page. */
router.get('/cart', function(req, res, next) {
  var orders = [];
  
  if(!req.session.cart){
    res.render("errors/empty_cart");
    return;
  }

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
        nome: results[0].nome,
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
  if(!req.session.cart){
    res.render("errors/empty_cart");
    return;
  }

  const db = new DB();
  
  const tavolo = parseInt(req.body.tavolo)
  if(!tavolo){
    res.json({result: "failed", message: "Nessun tavolo selezionato"});
    return;
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
    
    if(!req.session.orders)
      req.session.orders = [];

    // salvo l'id dell'ordine per poterlo valutare successivamente
    for(var i = 0; i < results.length; i++){
      req.session.orders.push(results[i].insertId);
    }

    /*
    const cart = Object.entries(req.session.cart);
    for(const[idPiatto, qty] of cart){
      if(!req.session.orders[idPiatto])
        req.session.orders[idPiatto] = qty;
      else
        req.session.orders[idPiatto] += qty;
    }
    */
    delete req.session.cart;
    res.json({result: "ok"});
  });    
});

module.exports = router;