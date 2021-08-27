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
      
    res.render('menu', {results},  {title:"Menù"});
    
  });
});

module.exports = router;
