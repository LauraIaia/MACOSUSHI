var express = require('express');
const { NotExtended } = require('http-errors');
var router = express.Router();

router.post('/addDish', function(req, res, next) {
    const id = req.body.idPiatto;

    if(!req.session.cart)
        req.session.cart = {};
    
    if(req.session.cart[id])
        req.session.cart[id]++;
    else
        req.session.cart[id] = 1;
    req.session.save((error) => {
        if(error)
            next(error);
        else 
            res.json({result: "ok"});
    });
});

router.post('/removeDish', function(req, res, next) {
    const id = req.body.idPiatto;

    if(!req.session.cart)
        req.session.cart = {};

    if (req.session.cart[id] && req.session.cart[id] > 0)
        req.session.cart[id]--;

    req.session.save((error) => {
        if (error)
            next(error);
        else
            res.json({ result: "ok" });
    });
});

module.exports = router;