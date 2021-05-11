const Book = require('../models/Book');
const User = require('../models/User');

exports.getBook = async (req, res) => {
  const { id } = req.params;
  try {
    let book = await Book.findById(id);
    res.json(book);
  } catch (err) {
    next(err);
  }
};

exports.getUserLibrary = async (req, res, next) => {
  const { city } = req.params;

  //if (!city) {
  //  customError('A city must be provided', 400);
  //  return;
  //}

  try {
    let userLibrary = await Book.find({}).populate({
      path: 'owner',
      match: {
        address: { city: city },
      },
    });
    res.json({ userLibrary });
  } catch (err) {
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

  //todo: add middleware to check book data is correct

  try {
    let newBook = await Book.create(bookData);
    let addBookToUser = await User.findByIdAndUpdate(
      owner,
      { $push: { booksToOffer: newBook._id } },
      { new: true }
    );
    res.json({ newBook, addBookToUser });
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  const { id } = req.params;

  if (!req.body) {
    //todo: add the custom error here
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

  try {
    let deletedBook = await Book.findByIdAndDelete(id);
    res.json(deletedBook);
  } catch (err) {
    next(err);
  }
};

exports.addInterestedUser = async (req, res, next) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    res.json('A user ID and a book ID must be provided.');
    return;
  }

  try {
    let updatedInterestedUser = await Book.findByIdAndUpdate(
      bookId,
      { $push: { interestedUsers: userId } },
      {
        new: true,
      }
    );
    res.json(updatedInterestedUser);
  } catch (err) {
    next(err);
  }
};
