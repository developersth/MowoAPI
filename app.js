var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require("cors");
const passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var bookingRouter = require('./routes/booking');
//require("dotenv").config();
const bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true  }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//var corsOptions = {origin: "http://192.168.137.196"};
var corsOptions = {origin: "http://localhost:8080"};
app.use(cors(corsOptions));
// Import passport
require('./config/passport');
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users',passport.authenticate('jwt', {session: false}),usersRouter);
app.use('/api/booking',passport.authenticate('jwt', {session: false}),bookingRouter);
//app.use('/api/users',usersRouter);
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
