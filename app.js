var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

require("dotenv").config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var welcomeRouter = require('./routes/welcomepage');
var cartRouter = require('./routes/cart');
var menuRouter = require('./routes/menu');
var signinRouter = require('./routes/signin');
var registerRouter = require('./routes/register');
var authRouter = require('./routes/auth');
var storicoRouter = require('./routes/storico');
const { MemoryStore } = require('express-session');

var app = express();

/**
 * Session Configuration
 */

 const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore(),
  maxAge: Date.now() + (60*60*1000) // scade dopo un'ora
};

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

/**
 * Passport Configuration
 */

 const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    return done(null, profile);
  });

/**
 *  App Configuration
 */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

const secured = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/signin");
};


//app.use('/', indexRouter);
//app.use('/', usersRouter);
app.use('/', welcomeRouter);
app.use('/', authRouter);
app.use('/', menuRouter);
app.use('/', cartRouter);
app.use('/', registerRouter);
app.use('/', signinRouter);
app.use('/', storicoRouter);

/*
app.get ('/', (req, res) => {
  res.render ('welcomepage');
});
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;