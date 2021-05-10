const express = require('express');
const router = express.Router();

const {
  getBook,
  getBooks,
  addBook,
  deleteBook,
  addInterestedUser,
} = require('../controllers/bookControllers');

router.route('/').get(getBooks).post(addBook);

router.route('/:id').get(getBook).delete(deleteBook);

router.route('/user').post(addInterestedUser);

module.exports = router;
