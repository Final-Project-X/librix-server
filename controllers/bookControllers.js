const Book = require('../models/Book');
const customError = require('../helpers/customErrorHandler');

exports.getBook = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    customError(`The book with id: ${id} does not exist`, 400);
    return;
  }

  try {
    let book = await Book.findById(id);
    res.json(book);
  } catch (err) {
    next(err);
  }
};

exports.getBooks = async (req, res) => {
  try {
    let books = await Book.find();
    res.json(books);
  } catch (err) {
    next(err);
  }
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

  if (!id) {
    customError(`The book with id: ${id} does not exist`, 400);
    return;
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBook);
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    customError(`The book with id: ${id} does not exist`, 400);
    return;
  }

  try {
    let deletedBook = await Book.findByIdAndDelete(id);
    res.json(deletedBook);
  } catch (err) {
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
