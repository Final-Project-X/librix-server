const Book = require('../models/Book');
const User = require('../models/User');
const customError = require('../helpers/customErrorHandler');
const mongoose = require('mongoose');

exports.getBook = async (req, res, next) => {
  const { id } = req.params;
  try {
    let book = await Book.findById(id);
    // id is a valid mongoose id
    if (!book) {
      return next(customError(`Book with ID: ${id} does not exist`, 400));
    }
    res.json(book);
  } catch (err) {
    // id is not a valid mongoose id
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    // server error
    next(err);
  }
};

exports.getUserLibrary = async (req, res, next) => {
  const { city } = req.params;
  // todo : check if its an actual city and make sure it starts with a capital letter
  // todo : check the user has not matched or is not already an interest user of one of the books

  try {
    let userLibrary = await Book.find().where('city').equals(city);
    if (userLibrary.length === 0) {
      next(
        customError(
          `There are no books available to trade in this city: ${city}`,
          400
        )
      );
      return;
    }
    res.json({ userLibrary });
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

//to your BooksToOffer
exports.addBook = async (req, res, next) => {
  //todo: create middleware to check the req.body
  const bookData = req.body;
  const { owner } = req.body;

  try {
    let newBook = await Book.create(bookData);
    await User.findByIdAndUpdate(
      owner,
      { $push: { booksToOffer: newBook._id } },
      { new: true }
    );
    res.json(newBook);
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  //todo : create middle ware to check req.body is okay
  const { id } = req.params;

  try {
    let book = await Book.findById(id);
    if (!book) {
      next(customError(`Book with ID: ${id} does not exist`, 400));
      return;
    }
    Object.assign(book, req.body);
    const bookUpdated = await book.save();
    res.json(bookUpdated);
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

  if (!userId || !bookId) {
    return next(customError('A user ID and a book ID must be provided', 400));
  }

  try {
    let updatedInterestedUser = await Book.findByIdAndUpdate(
      bookId,
      { $push: { interestedUsers: userId } },
      {
        new: true,
      }
    );
    await User.findByIdAndUpdate(userId, {
      $push: { booksInterestedIn: bookId },
    });
    res.json(updatedInterestedUser);
  } catch (err) {
    next(err);
  }
};

exports.addBooksToRemember = async (req, res, next) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return next(customError('A user ID and a book ID must be provided', 400));
  }
  try {
    let updateBookToRememberInUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: { booksToRemember: bookId },
      },
      {
        new: true,
      }
    );
    res.json(updateBookToRememberInUser);
  } catch (err) {
    next(err);
  }
};
