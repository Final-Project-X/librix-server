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
  addBookToSavedBooks,
} = require('../controllers/bookControllers');
const { isMatch } = require('../middleware/isMatch');
const { addMatch } = require('../controllers/matchControllers');

router.route('/').get(getBooks).post(addBook);
router.route('/savedBooks').post(addBookToSavedBooks);

router.route('/user').post(addInterestedUser, isMatch, addMatch);

router.route('/user/:city').get(getUserLibrary);

router.route('/:id').get(getBook).put(updateBook).delete(deleteBook);

module.exports = router;
