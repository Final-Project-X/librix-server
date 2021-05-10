const express = require('express');
const router = express.Router();

const {
  getBook,
  getBooks,
  addBook,
  deleteBook,
  updateBook,
  addInterestedUser,
} = require('../controllers/bookControllers');

router.route('/').get(getBooks).post(addBook);

router.route('/:id').get(getBook).put(updateBook).delete(deleteBook);

router.route('/user').post(addInterestedUser);

module.exports = router;
