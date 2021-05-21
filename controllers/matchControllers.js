const Match = require('../models/Match');
const User = require('../models/User');
const customError = require('../helpers/customErrorHandler');
const mongoose = require('mongoose');

// just for checking reason
exports.getMatches = async (req, res, next) => {
  let matches = await Match.find();
  res.json(matches);
};

exports.getMatch = async (req, res, next) => {
  const { id } = req.params;

  try {
    let match = await Match.findById(id)
      .populate('bookOne')
      .populate('bookTwo');

    if (!match) {
      next(customError(`Match with ID: ${id} does not exist`, 400));
    }

    res.json(match);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }

    next(err);
  }
};

exports.addMatch = async (req, res, next) => {
  const { bookOne, matchBooks } = req.body;
  //console.log('body =>', req.body);

  try {
    let matchesArray = [];
    for (let i = 0; i < matchBooks.length; i++) {
      let newMatch = await Match.create({
        bookOne: bookOne,
        bookTwo: matchBooks[i]._id,
      });
      matchesArray.push(newMatch._id);
      let match = await Match.findOne(newMatch._id)
        .populate('bookOne')
        .populate('bookTwo');

      await User.findByIdAndUpdate(match.bookOne.owner, {
        $push: { matches: match._id },
      });
      await User.findByIdAndUpdate(match.bookTwo.owner, {
        $push: { matches: match._id },
      });
    }
    console.log(`stored ${matchesArray.length} matches `);
    res.json(matchesArray.length);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    next(err);
  }
};

exports.updateMatch = async (req, res, next) => {
  const { id } = req.params;

  try {
    const match = await Match.findById(id);

    if (!match) {
      next(customError(`Match with ID: ${id} does not exist`, 400));
      return;
    }

    Object.assign(match, req.body);
    const updatedMatch = await match.save();
    console.log('match updated');
    res.json(updatedMatch);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    next(err);
  }
};

// delete Match
exports.deleteMatch = async (req, res, next) => {
  const { id } = req.params;

  try {
    const match = await Match.findById(id)
      .populate('bookOne')
      .populate('bookTwo');

    if (!match) {
      next(customError(`Match with ID: ${id} does not exist`, 400));
      return;
    }

    await User.findByIdAndUpdate(match.bookOne.owner, {
      $pull: { matches: match._id },
    });
    await User.findByIdAndUpdate(match.bookTwo.owner, {
      $pull: { matches: match._id },
    });

    await match.delete();
    res.json(match);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    next(err);
  }
};
