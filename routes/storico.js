var express = require('express');
var DB = require('../db');
var router = express.Router();

/* GET home page. */
router.get('/storico', function(req, res, next) {
  var db = new DB();
    if(!req.user){
      //error
      res.render('errore_storico', {title: 'errore_storico' });
      return;
    }
  const idUtente = req.user.userProfile.id;
  db.getOrders(idUtente, (error, results, fields) => {
    if(error) {
      next(error);
      return;
    };
    res.render('storico', {results, title: 'Storico' });
});
});

module.exports = router;