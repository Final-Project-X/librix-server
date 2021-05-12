const express = require('express');
const router = express.Router();

const {
  getMatches,
  getMatch,
  addMatch,
} = require('../controllers/matchControllers');

router.route('/').get(getMatches).post(addMatch);

router.route('/:id').get(getMatch);

module.exports = router;
