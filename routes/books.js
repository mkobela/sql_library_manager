var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

const errorMissingBook = "The book requested doesn't exist.";

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("all_books", { books });
}));


router.get('/new', function (req, res, next) {
  res.render("new_book", { book: {}, title: "New Book" });
});

/* POST create book */
router.post('/', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.create(req.body);
    if (book) {
      res.redirect("/books");
    } else {
      const err = createErr(404, "The book could not be added.");
      next(err);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new_book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;b
    }
  }
}));

router.get('/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("book_detail", { book, title: "Edit Book" });
  } else {
    const err = createErr(404, errorMissingBook);
    next(err);
  }
}));

/* Update a book */
router.post('/:id', asyncHandler(async (req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      const err = createErr(404, errorMissingBook);
      next(err);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render(`book_detail`, { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error;
    }
  }
}));

/* Delete individual book */
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    const err = createErr(404, errorMissingBook);
    next(err);
  }
}));

function createErr(code, message){
  const err = createError(code);
  err.message = message;
 return err;
}

module.exports = router;