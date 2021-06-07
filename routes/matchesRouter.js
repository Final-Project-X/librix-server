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

//const { auth } = require('../middleware/auth');

//main route => /matches
router.route('/').get(getMatches).post(setBookToReceived, deleteAfterExchange);

router
  .route('/:id')
  .get(getMatch)
  .put(updateMatch)
  .delete(deleteMatch)
  .post(updateBookAndMatchStatus);

module.exports = router;
