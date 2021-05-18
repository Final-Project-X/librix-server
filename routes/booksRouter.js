const express = require('express');
const router = express.Router();

const {
  getBook,
  getUserLibrary,
  getBooks,
  deleteBook,
  updateBook,
  addInterestedUser,
} = require('../controllers/bookControllers');

router.route('/').get(getBooks);

router.route('/:id').get(getBook).put(updateBook).delete(deleteBook);

router.route('/user').post(addInterestedUser);

router.route('/user/:city').get(getUserLibrary);

module.exports = router;
