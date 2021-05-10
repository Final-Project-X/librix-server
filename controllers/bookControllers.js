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

exports.updateBook = async (req, res, next) => {
  const { id } = req.params;

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
    console.log(err);
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
