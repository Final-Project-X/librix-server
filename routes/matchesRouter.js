const express = require('express');
const router = express.Router();

const {
  getMatches,
  getMatch,
  updateMatch,
  deleteMatch,
  deleteAfterExchange,
  updateBookAndMatchStatus,
} = require('../controllers/matchControllers');

const { setBookToReceived } = require('../middleware/setBookToReceived');

const { auth } = require('../middleware/auth');

//main route => /matches
router
  .route('/')
  .get(getMatches)
  .post(auth, setBookToReceived, deleteAfterExchange);

router
  .route('/:id')
  .get(auth, getMatch)
  .put(auth, updateMatch)
  .delete(auth, deleteMatch)
  .post(auth, updateBookAndMatchStatus);

module.exports = router;
