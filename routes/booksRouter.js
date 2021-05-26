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
  deleteBookFromSavedBooks,
} = require('../controllers/bookControllers');
const {
  isUserAlreadyInterestedInBook,
} = require('../middleware/isUserAlreadyInterestedInBook');
const { isMatch } = require('../middleware/isMatch');
const { addMatch } = require('../controllers/matchControllers');

router.route('/').get(getBooks).post(addBook);
router
  .route('/savedBooks')
  .post(addBookToSavedBooks)
  .delete(deleteBookFromSavedBooks);

router
  .route('/user')
  .post(isUserAlreadyInterestedInBook, addInterestedUser, isMatch, addMatch);

router.route('/user/:id').post(getUserLibrary);

router.route('/:id').get(getBook).put(updateBook).delete(deleteBook);

module.exports = router;
