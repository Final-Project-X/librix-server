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
  addBooksToRemember,
} = require('../controllers/bookControllers');
const {
  isUserAlreadyInterestedInBook,
} = require('../middleware/isUserAlreadyInterestedInBook');
const { isMatch } = require('../middleware/isMatch');
const { addMatch } = require('../controllers/matchControllers');

router.route('/').get(getBooks).post(addBook);
router.route('/savedBooks').post(addBooksToRemember);

router
  .route('/user')
  .post(isUserAlreadyInterestedInBook, addInterestedUser, isMatch, addMatch);

router.route('/user/:city').get(getUserLibrary);

router.route('/:id').get(getBook).put(updateBook).delete(deleteBook);

module.exports = router;
