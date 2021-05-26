const express = require('express');
const router = express.Router();

const {
  getUser,
  getUsers,
  updateUser,
  addUser,
  deleteUser,
  loginUser,
  logoutUser,
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

const { isMatch } = require('../middleware/isMatch');

//MAIN ROUTE => /user
// todo auth
router
  .route('/')
  .post(userValidationRules(), userValidationErrorHandling, addUser);

//TODO delete this route
router.route('/users').get(getUsers).post(getUser);

router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

router
  .route('/savedBooks')
  .post(addBookToSavedBooks)
  .delete(deleteBookFromSavedBooks);

router
  .route('/:id')
  .get(getUserLibrary)
  .put(updateUser)
  .delete(deleteUser)
  .post(addInterestedUser, isMatch, addMatch);

module.exports = router;
