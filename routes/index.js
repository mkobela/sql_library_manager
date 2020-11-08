var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

/* GET home page. */
router.get('/', async function (req, res, next) {
  // Testing code, commmented out
  // const books = await Book.findAll();
  // console.log(books.map(book => book.toJSON()));
  // res.json(books);

  res.redirect("/books")
});

module.exports = router;
