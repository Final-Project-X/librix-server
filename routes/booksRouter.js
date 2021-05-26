const express = require('express');
const router = express.Router();

const {
  getBook,
  getBooks,
  deleteBook,
  addBook,
  updateBook,
} = require('../controllers/bookControllers');

//main route => /books
// todo auth, delete get books
router.route('/').get(getBooks).post(addBook);

router.route('/:id').get(getBook).put(updateBook).delete(deleteBook);

module.exports = router;
