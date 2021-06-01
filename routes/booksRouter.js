const express = require('express');
const router = express.Router();

const {
  getBook,
  getBooks,
  deleteBook,
  addBook,
  updateBook,
} = require('../controllers/bookControllers');

const { auth } = require('../middleware/auth');

//main route => /books
// todo delete get books
router.route('/').get(getBooks).post(auth, addBook);

router
  .route('/:id')
  .get(auth, getBook)
  .put(auth, updateBook)
  .delete(auth, deleteBook);

module.exports = router;
