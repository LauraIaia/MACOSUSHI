var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('welcomepage', {loggedIn: req.user!=undefined, title: 'MACOSUSHI' });
});

module.exports = router;