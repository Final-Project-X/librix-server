const Book = require('../models/Book');
const User = require('../models/User');
const customError = require('../helpers/customErrorHandler');
const customResponse = require('../helpers/customResponseHandler');
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
  let { city, genre, language } = req.body;
  const { id } = req.params;

  const user = await User.findById(id).populate('matches');

  if (!user) {
    return next(customError(`No user with id: ${id} exists`, 400));
  }

  if (!city) {
    city = user.city;
  }

  // /.*/g => regular expression that means any
  try {
    let userLibrary = await Book.find()
      .where('city')
      .equals(city.toLowerCase())
      .where('genre')
      .equals(genre || /.*/g)
      .where('language')
      .equals(language || /.*/g);

    if (userLibrary.length === 0) {
      return next(
        customError(
          `There are no books available to trade with these filters.`,
          400
        )
      );
    }

    const booksToCheck = [
      ...user.booksToOffer,
      ...user.booksToRemember,
      ...user.booksInterestedIn,
    ];

    const filteredUserLibrary = userLibrary.filter((book) => {
      let isNotAlreadyAssosiatedWithUser = true;

      for (let i = 0; i < booksToCheck.length; i++) {
        if (booksToCheck[i].toString() === book._id.toString()) {
          isNotAlreadyAssosiatedWithUser = false;
          break;
        }
      }

      if (isNotAlreadyAssosiatedWithUser) {
        return book;
      }
    });

    res.json(filteredUserLibrary);
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
  const { bookId } = req.body;
  const { id } = req.params;

  try {
    await Book.findByIdAndUpdate(
      bookId,
      { $push: { interestedUsers: id } },
      {
        new: true,
      }
    );
    await User.findByIdAndUpdate(id, {
      $push: { booksInterestedIn: bookId },
    });
    next();
  } catch (err) {
    next(err);
  }
};

exports.addBookToSavedBooks = async (req, res, next) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return next(customError('A user ID and a book ID must be provided', 400));
  }
  try {
    let user = await User.findById(userId);

    if (!user) {
      return next(
        customError(`The user with id: ${userId} does not exists`, 400)
      );
    }

    if (user.booksToRemember.includes(bookId)) {
      return next(customError('Book is already saved', 400));
    }

    await user.update({
      $push: { booksToRemember: bookId },
    });

    res.json(customResponse(`Book is saved`));
  } catch (err) {
    next(err);
  }
};

exports.deleteBookFromSavedBooks = async (req, res, next) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return next(customError('A user ID and a book ID must be provided', 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(customError(`User with id: ${userId} does not exist`, 400));
  }

  if (!user.booksToRemember.includes(bookId)) {
    return next(
      customError(
        `Book with id: ${bookId} is not found in this users saved books`,
        400
      )
    );
  }

  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { booksToRemember: bookId },
      },
      {
        new: true, // could be deleted cause we are not sending it
      }
    );
    res.json(customResponse(`Book is deleted from Saved Books`));
  } catch (err) {
    next(err);
  }
};
