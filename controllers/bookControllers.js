const Book = require('../models/Book');
const User = require('../models/User');
const customError = require('../helpers/customErrorHandler');
const customResponse = require('../helpers/customResponseHandler');
const mongoose = require('mongoose');

exports.getBook = async (req, res, next) => {
  const { id } = req.params;

  try {
    let book = await Book.findById(id);
    if (!book) {
      return next(customError(`Book with ID: ${id} does not exist`, 400));
    }

    res.json(book);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    next(err);
  }
};

// get the user a selection of books that the user can then swipe through
exports.getUserLibrary = async (req, res, next) => {
  let { city, genre, language } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate('matches');
    if (!user) {
      return next(customError(`No user with id: ${id} exists`, 400));
    }
    if (city) {
      city = city.toLowerCase();
    }

    // /.*/g => regular expression that means any
    let userLibrary = await Book.find()
      .where('city')
      .equals(city || /.*/g)
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
      next(customError(`User with ID ${id} does not exist`, 400));
    }
    next(err);
  }
};

exports.getBooks = async (req, res) => {
  let books = await Book.find();
  res.json(books);
};

exports.addBook = async (req, res, next) => {
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
    let bookToDelete = await Book.findById(id);

    let user = await User.findById(bookToDelete.owner).populate('matches');

    const isBookInUserMatches = user.matches.filter(
      (match) =>
        match.bookOne.toString() === bookToDelete._id.toString() ||
        match.bookTwo.toString() === bookToDelete._id.toString()
    );

    if (isBookInUserMatches.length !== 0) {
      return res.json(
        customResponse('Your Book still has Matches, please delete them first.')
      );
    }

    // remove the book from any interested users
    bookToDelete.interestedUsers.map(
      async (user) =>
        await User.findByIdAndUpdate(user, {
          $pull: { booksInterestedIn: bookToDelete._id },
        })
    );

    // remove the book from the user
    user.update({
      $pull: { booksToOffer: bookToDelete._id },
    });

    bookToDelete.delete();

    res.json(customResponse(`Your book has been deleted.`));
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
    let book = await Book.findByIdAndUpdate(
      bookId,
      { $push: { interestedUsers: id } },
      { new: true }
    );

    let user = await User.findByIdAndUpdate(
      id,
      {
        $push: { booksInterestedIn: bookId },
      },
      { new: true }
    );

    req.params = { id: user._id };
    req.body = { bookId: book._id };
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

    // save this book for the user
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

  try {
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

    // remove the book from the saved books
    await User.findByIdAndUpdate(userId, {
      $pull: { booksToRemember: bookId },
    });

    res.json(customResponse(`Book is deleted from Saved Books`));
  } catch (err) {
    next(err);
  }
};
