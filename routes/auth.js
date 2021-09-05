const express = require("express");
const router = express.Router();
const passport = require("passport");
const querystring = require("querystring");
require("dotenv").config();

const Db = require('../db');
const db = new Db();

router.get("/signin/:page?",
  (req, res, next) => {
    if(req.params.page)  
      req.session.returnTo = req.params.page;
    next();
  },
  passport.authenticate("auth0", {scope: "openid email profile"}),
  (req, res) => {
      res.redirect("/");
  });

  router.get("/callback", (req, res, next) => {
    passport.authenticate("auth0", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/signin");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        db.userProfileExists(user.id, (error, results, fields) => {
          if(error){
            next(error);
            return;
          }
          
          const returnTo = req.session.returnTo  || "/";
          delete req.session.returnTo;
          res.locals.currentPage = returnTo;
          
          if(results && results[0]){
            res.redirect(returnTo);
          }
          else{
            db.addUserProfile(user, (error, results, fields) => {
              if(error){
                next(error);
                return;
              }
                if(results){
                  res.redirect(returnTo);  
                }else{
                  //error
                }
            });
          }
        });
      });
    })(req, res, next);
  });

  router.get("/logout", (req, res) => {
    req.logOut();

    let returnTo = req.protocol + "://" + req.hostname;
    const port = req.connection.localPort;
  
    if (port !== undefined && port !== 80 && port !== 443) {
      returnTo =
        process.env.NODE_ENV === "production"
          ? `${returnTo}/`
          : `${returnTo}:${port}/`;
    }
  
    const logoutURL = new URL(
      `https://${process.env.AUTH0_DOMAIN}/v2/logout`
    );
  
    const searchString = querystring.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      returnTo: returnTo
    });
    logoutURL.search = searchString;
  
    req.session.destroy(() => {
      res.redirect(logoutURL);
    });
  });

  module.exports = router;