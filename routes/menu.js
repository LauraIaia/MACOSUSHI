var express = require('express');
var DB = require('../db');
var router = express.Router();

router.get('/menu', function(req, res, next) {
  var db = new DB();
  db.getAllDishes((error, results, fields) => {
    if(error) {
      next(error);
      return;
    }

    const dishes = new Map();
    var sottogruppo = "";
    for (var i=0; i<results.length; i++){
      var dish = results[i];
      var st = dish.sottogruppo; 
     
     if(st == sottogruppo){
        dishes.get(st).push(dish);
     }
     else{
       dishes.set(st, [dish]);
     }
     sottogruppo = st;
    };
    
    var orders = 0;
    if(req.session.cart){
      const cart = Object.entries(req.session.cart);
      for(const[idPiatto, qty] of cart){
        orders += qty;
      }      
      //req.session.cart.forEach((value) => {orders += value;});
    }

    var o ={sottogruppi: Array.from(dishes.keys()), results: dishes, title:"Menù", orders, loggedIn: req.user!=undefined};
    res.render('menu', o);

  });
});

module.exports = router;
