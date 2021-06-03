const express = require('express');
const router = express.Router();

const {
  getMatches,
  getMatch,
  updateMatch,
  deleteMatch,
  deleteAfterExchange,
} = require('../controllers/matchControllers');

//const { auth } = require('../middleware/auth');

//main route => /matches
router.route('/').get(getMatches).post(deleteAfterExchange);

router.route('/:id').get(getMatch).put(updateMatch).delete(deleteMatch);

module.exports = router;
