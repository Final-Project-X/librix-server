const express = require('express');
const router = express.Router();

const {
  getBook,
  getUserLibrary,
  getBooks,
  deleteBook,
  addBook,
  updateBook,
  addInterestedUser,
} = require('../controllers/bookControllers');

router.route('/').get(getBooks).post(addBook);

router.route('/:id').get(getBook).put(updateBook).delete(deleteBook);

router.route('/user').post(addInterestedUser);

router.route('/user/:city').get(getUserLibrary);

module.exports = router;
