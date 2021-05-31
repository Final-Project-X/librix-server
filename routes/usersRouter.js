const express = require('express');
const router = express.Router();

const {
  getUsers,
  updateUser,
  addUser,
  deleteUser,
  loginUser,
  logoutUser,
  getMatchPartner,
  getUserMatches,
} = require('../controllers/userControllers');

const {
  getUserLibrary,
  addBookToSavedBooks,
  deleteBookFromSavedBooks,
  addInterestedUser,
} = require('../controllers/bookControllers');

const { addMatch } = require('../controllers/matchControllers');

const {
  userValidationRules,
  userValidationErrorHandling,
} = require('../middleware/validation');

const {
  isUserAlreadyInterestedInBook,
} = require('../middleware/isUserAlreadyInterestedInBook');

const { isMatch } = require('../middleware/isMatch');

//MAIN ROUTE => /user
// todo auth
router
  .route('/')
  .post(userValidationRules(), userValidationErrorHandling, addUser);

//TODO delete get users
router.route('/users').get(getUsers).post(getMatchPartner);

router.route('/login').post(loginUser);

router.route('/logout').get(logoutUser);

router.route('/addSavedBook').post(addBookToSavedBooks);

router.route('/removeSavedBook').post(deleteBookFromSavedBooks);

router
  .route('/:id')
  .get(getUserMatches)
  .put(updateUser)
  .delete(deleteUser)
  .post(isUserAlreadyInterestedInBook, addInterestedUser, isMatch, addMatch);

// get user library is a post call
router.route('/library/:id').post(getUserLibrary);

module.exports = router;
