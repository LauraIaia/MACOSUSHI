var express = require('express');
var DB = require('../db');
var router = express.Router();

/* GET home page. */
router.get('/menu', function(req, res, next) {
  var db = new DB();
  db.getDishes((error, results, fields) => {
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
      req.session.cart.forEach((value) => {orders += value;});
    }

    var o ={sottogruppi: Array.from(dishes.keys()), results: dishes, title:"Menù", orders};
    res.render('menu', o);

  });

  router.post('/menu/addDish', function(req, res, next) {
    const id = req.body.idPiatto;

    if(!req.session.cart)
      req.session.cart = {};
      //req.session.cart = new Map();
    
    
    if(req.session.cart[id])
      req.session.cart[id]++;
    else
      req.session.cart[id] = 1;

    res.status(200).send();
  });
});

module.exports = router;
