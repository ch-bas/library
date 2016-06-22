var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var socket_io = require("socket.io");
var request = require('request');
var cheerio = require('cheerio');

var routes = require('./routes/index');
var users = require('./routes/users');
var livres = require('./routes/livres');
var connect        = require('connect');
var methodOverride = require('method-override');


var app = express();
app.use(methodOverride('_method'));
var io = socket_io();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'atelier 8',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.connect('mongodb://localhost/atelierExam');

app.use('/', require('./routes/index')(io));
app.use('/category', users);
app.use('/pc', require('./routes/pcs'));
app.use('/livre', livres(io));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
