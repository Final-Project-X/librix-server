const express = require('express');
const router = express.Router();

const {
  getMatches,
  getMatch,
  updateMatch,
  deleteMatch,
} = require('../controllers/matchControllers');

//const { auth } = require('../middleware/auth');

//main route => /matches
router.route('/').get(getMatches);

router.route('/:id').get(getMatch).put(updateMatch).delete(deleteMatch);

module.exports = router;
