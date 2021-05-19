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

const { addMatch } = require('../controllers/matchControllers');

router.route('/').get(getUsers).post(addUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)
  .post(addMatch);

router.route('/login').post(loginUser);

module.exports = router;
