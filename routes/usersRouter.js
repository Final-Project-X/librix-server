const express = require('express');
const router = express.Router();

const {
  getUser,
  getUsers,
  updateUser,
  addUser,
  deleteUser,
  loginUser,
} = require('../controllers/userControllers');

const {
  userValidationRules,
  userValidationErrorHandling,
} = require('../middleware/validation');

router
  .route('/')
  .get(getUsers)
  .post(userValidationRules(), userValidationErrorHandling, addUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

router.route('/login').post(loginUser);

module.exports = router;
