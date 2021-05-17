const Match = require('../models/Match');

exports.getMatches = async (req, res, next) => {
  let matches = await Match.find();
  res.json(matches);
};

exports.getMatch = async (req, res, next) => {
  const { id } = req.params;

  try {
    let match = await Match.findById(id);
    res.json(match);
  } catch (err) {
    next(err);
  }
};

exports.addMatch = async (req, res, next) => {
  const matchData = req.body;

  //todo : add validation to see if these two books havent already been matched

  try {
    let newMatch = await Match.create(matchData);
    res.json(newMatch);
  } catch (err) {
    next(err);
  }
};
