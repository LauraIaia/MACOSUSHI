var express = require('express');
var DB = require('../db');
var router = express.Router();

/* GET home page. */
router.get('/storico', function(req, res, next) {
  if(!req.user){
    //error
    res.render('errors/login_needed', {title: 'errore_storico' });
    return;
  }
  const idUtente = req.user.id;
  var db = new DB();
  db.getOrders(idUtente, (error, results, fields) => {
    if(error) {
      next(error);
      return;
    };
    const dishes = results;
    db.getSottogruppi((error, results, fields) =>{
      res.render('storico', {sottogruppi: results, dishes, title: 'Storico' });
    });
    
  });
});

module.exports = router;