var express = require('express');
var DB = require('../db');
var router = express.Router();

router.get('/review', function(req, res, next) {
    if(!req.session.orders){
        res.render('errors/no_orders');
        return;
    }
    /*
    var dishes = [];
    const orders = Object.entries(req.session.orders);

    var ids = [];
    for(const[idPiatto] of orders){
        ids.push(idPiatto);
    }
    */
   /*
    var orders = [];
    var voti = {};
    const o = req.session.orders;
    for(var i = 0; i < o.length; i++){
        orders.push(o[i].idOrdine);
        
        if(o[i].voto)
            voti[o[i].idOrdine] = o[i].voto;
    }
    */
    const db = new DB();
    db.getDishes(req.session.orders, (error, results, fields) => {
        if(error){
            next(error);
            return;
        }
        console.log(results);
        var dishes = []

        for(var i = 0; i < results.length; i++){
            dishes.push(results[i][0]);
        }

        res.render('review', {dishes});
    });
});

router.post('/review', function(req, res, next) {
    /*
    if(!req.body.idPiatto || !req.body.review){
        //error
        return;
    }
    const review = {
        piatto: req.body.idPiatto, 
        voto: req.body.review, 
        utente: req.user.id, 
        sessione: req.session.id
    };
    */
    if(!req.body.idOrdine || !req.body.review){
        //error
        return;
    }   
    const review = {
        idOrdine: req.body.idOrdine, 
        voto: req.body.review
    };   
    const db = new DB();
    db.addReview(review,(error, results, fields) => {
        if(error){
            next(error);
            return;
        }
        /*
        if(req.session.orders){
            for(var i = 0; i < req.session.orders.length; i++){
                if(req.session.orders[i].idOrdine == review.idOrdine){
                    req.session.orders[i].voto = review.voto;
                }
            }
        }
        */
    });
});

module.exports = router;