const express = require('express');
const router = express.Router();

const {
  getMatches,
  getMatch,
  updateMatch,
  deleteMatch,
} = require('../controllers/matchControllers');

//main route => /matches
// todo auth
router.route('/').get(getMatches); // todo delete this get

router.route('/:id').get(getMatch).put(updateMatch).delete(deleteMatch);

module.exports = router;
