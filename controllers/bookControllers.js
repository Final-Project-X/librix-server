const Book = require('../models/Book');
const customError = require('../helpers/customErrorHandler');
const mongoose = require('mongoose');

exports.getBook = async (req, res, next) => {
  const { id } = req.params;

  try {
    let book = await Book.findById(id);
    res.json(book);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`Book with ID ${id} does not exist`, 400));
    }
    next(err);
  }
};

exports.getBooks = async (req, res) => {
  let books = await Book.find();
  res.json(books);
};

exports.addBook = async (req, res, next) => {
  //todo: create middleware to check the req.body
  const bookData = req.body;

  try {
    let newBook = await Book.create(bookData);
    res.json(newBook);
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  const { id } = req.params;
  //todo : create middle ware to check req.body is okay

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBook);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`Book with ID ${id} does not exist`, 400));
    }
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  const { id } = req.params;

  try {
    let deletedBook = await Book.findByIdAndDelete(id);
    res.json(deletedBook);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`Book with ID ${id} does not exist`, 400));
    }
    next(err);
  }
};

exports.addInterestedUser = async (req, res, next) => {
  const { userId, bookId } = req.body;

  //todo : turn this check into a middleware
  if (!userId || !bookId) {
    customError('A user ID and a book ID must be provided', 500);
    return;
  }

  try {
    let updatedInterestedUser = await Book.findByIdAndUpdate(
      bookId,
      { interestedUsers: [...interestedUsers, userId] },
      {
        new: true,
      }
    );
    res.json(updatedInterestedUser);
  } catch (err) {
    next(err);
  }
};
