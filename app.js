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
var test = require('./routes/test');
require("dotenv").config();
const bodyParser = require('body-parser');
var app = express();

// Connect to MongoDB
/* const URI_CLOUD ="mongodb+srv://sa:H8Lv3Rq72FxmD6up@cluster0.tn9vy.azure.mongodb.net/test?retryWrites=true&w=majority";
const URI_LOCAL =`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
mongoose.connect(URI_LOCAL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Successfully Connect to MongoDB.");

  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  }); */

// sync database mysql

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
var corsOptions = {origin: "http://localhost:8080"};
app.use(cors(corsOptions));
// Import passport
require('./config/passport');
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users',passport.authenticate('jwt', {session: false}),usersRouter);
//app.use('/api/test',passport.authenticate('jwt', {session: false}),test);
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
