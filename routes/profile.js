var express = require('express');
const Db = require('../db');
var router = express.Router();

const db = new Db();

const secured = (req, res, next) => {
    if (req.user) {
      return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
  };

  router.get("/user", secured, (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;

    db.userProfileExists(userProfile.id, (error, results, fields) => {
      if(error){
        next(error);
        return;
      }
        //throw error;

      if(results && results[0]){
        res.render("welcome", {
          title: "Welcome",
          userProfile: userProfile
        });
      }
      else{
        db.addUserProfile(userProfile, (error, results, fields) => {
          if(error){
            next(error);
            return;
          }
            if(results){
              res.render("user", {
                title: "Profile",
                userProfile: userProfile
              });  
            }
        });
      }


    });    
  });

  module.exports = router;