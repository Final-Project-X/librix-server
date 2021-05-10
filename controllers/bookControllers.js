const Book = require('../models/Book');

exports.getBook = async (req, res) => {
  const { id } = req.params;
  let book = await Book.findById(id);
  res.json(book);
};

exports.getBooks = async (req, res) => {
  let books = await Book.find();
  res.json(books);
};

exports.addBook = async (req, res, next) => {
  const bookData = req.body;

  try {
    let newBook = await Book.create(bookData);
    res.json(newBook);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  const { id } = req.params;

  try {
    let deletedBook = await Book.findByIdAndDelete(id);
    res.json(deletedBook);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.addInterestedUser = async (req, res, next) => {
  const { userId, bookId } = req.body;

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
    console.log(err);
    next(err);
  }
};
