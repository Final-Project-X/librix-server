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

const { auth } = require('../middleware/auth');

const {
  isUserAlreadyInterestedInBook,
} = require('../middleware/isUserAlreadyInterestedInBook');

const { isMatch } = require('../middleware/isMatch');

//MAIN ROUTE => /user
router
  .route('/')
  .post(userValidationRules(), userValidationErrorHandling, addUser);

router.route('/users').get(getUsers).post(auth, getMatchPartner);

router.route('/login').post(loginUser);

router.route('/logout').get(logoutUser);

router.route('/addSavedBook').post(auth, addBookToSavedBooks);

router.route('/removeSavedBook').post(auth, deleteBookFromSavedBooks);

router
  .route('/:id')
  .get(auth, getUserMatches)
  .put(auth, updateUser)
  .delete(auth, deleteUser)
  .post(
    auth,
    isUserAlreadyInterestedInBook,
    addInterestedUser,
    isMatch,
    addMatch
  );

router.route('/library/:id').post(auth, getUserLibrary);

module.exports = router;
