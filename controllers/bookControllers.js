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
