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
    var o ={sottogruppi: Array.from(dishes.keys()), results: dishes, title:"Menù"};
    res.render('menu', o);

  });

  router.post('/menu', function(req, res, next) {
    const carrello = req.session.carrello;
    const id = req.body.idPiatto;

    if(!carrello){
      carrello = new Map();
      req.session.carrello = carrello;
    }
    
    if(carrello.has(id))
      carrello[id]++;
    else
      carrello.set(id, 1);


    console.log(req);
  });
});

module.exports = router;
