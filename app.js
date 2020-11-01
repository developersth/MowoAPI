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
var machineRouter = require('./routes/machine');
var hospitalRouter = require('./routes/hospital');
//require("dotenv").config();
const bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//var corsOptions = {origin: "http://localhost:8080"};
//var corsOptions =  {origin: ["http://localhost:8080","www.two.com","www.three.com"],default: "http://localhost:8080"};
var allowlist = ['https://tee-gpstraking.web.app', 'http://localhost:8080']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate));
// Import passport
require('./config/passport');
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', passport.authenticate('jwt', { session: false }), usersRouter);
app.use('/api/booking', passport.authenticate('jwt', { session: false }), bookingRouter);
app.use('/api/machine', passport.authenticate('jwt', { session: false }), machineRouter);
app.use('/api/hospital', passport.authenticate('jwt', { session: false }), hospitalRouter);
//app.use('/api/users',usersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
