var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var profilo = req.user != undefined;
  res.render('welcomepage', {profilo, title: 'MACOSUSHI' });
});

module.exports = router;