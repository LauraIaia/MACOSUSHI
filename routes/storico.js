var express = require('express');
var DB = require('../db');
var router = express.Router();

/* GET home page. */
router.get('/storico', function(req, res, next) {
  var db = new DB();
  db.getOrders(idUtente, (error, results, fields) => {
    if(error) {
      next(error);
      return;
    };
});
});