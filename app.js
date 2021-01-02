/***
 * @author Michael Kobela <mkobela@gmail.com>
 ***/

/******************************************
Treehouse FSJS Techdegree:
Project 8 - SQL Library Manager
******************************************/

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

const db = require('./models/index');

var app = express();

// setup static files
app.use('/static', express.static('public'));

// view engine setup, use pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// handler for no routes found
app.use(function (req, res, next) {
  // create 404 error, pass off to global error handler
  const error = createError(404, 'Oops, that page does not exist!');
  next(error);
});

// Global error handler
app.use(function (err, req, res, next) {
  if (err.status === 404) {
    // 404 not found handler
    err.message = err.message;
    res.status = err.status;
    res.render('page-not-found', { err });
  } else {
    // global error handler
    err.status = err.status || 500;
    err.message = err.message || "Oops, unexpected system failure";
    res.status = err.status;
    
    console.log(err.status);
    console.log(err.message);
    res.render('error', { err });
  }
});

//IIFE to test DB connection
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

module.exports = app;
