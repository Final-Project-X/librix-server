const express = require('express');
const router = express.Router();

const {
  getBook,
  getBooks,
  deleteBook,
  addBook,
  updateBook,
} = require('../controllers/bookControllers');

const { validateBook } = require('../middleware/validation');

//const { auth } = require('../middleware/auth');


//main route => /books
// todo delete get books
router.route('/').get(getBooks).post(validateBook, addBook);


router.route('/:id').get(getBook).put(updateBook).delete(deleteBook);


module.exports = router;
