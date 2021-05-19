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

//ADD A MATCH AND CHECK IF ALL WORKS OUT
//Todo put some of the validation tests in middleware
exports.addMatch = async (req, res, next) => {
  const { bookOne, bookTwo } = req.body;
  const { id } = req.params;
  const user = await User.findById(id).populate('matches');

  if (!user) {
    next(customError(`User with ID: ${id} does not exist`, 400));
    return;
  }

  // same Id with same id = will most likely not happen
  const areBooksTheSame = bookOne === bookTwo;
  if (areBooksTheSame) {
    next(customError(`book one and book two are the same`, 400));
    return;
  }

  // check if user owns one book and is interested in one book
  const userIsInterestedInBook =
    user.booksInterestedIn.includes(bookOne) ||
    user.booksInterestedIn.includes(bookTwo);

  const userOffersBook =
    user.booksToOffer.includes(bookOne) || user.booksToOffer.includes(bookTwo);

  if (!userIsInterestedInBook || !userOffersBook) {
    next(customError(`Match is not valid`, 400));
    return;
  }

  const checkIfMatchExists = () => {
    for (userMatch in user.matches) {
      if (
        userMatch.bookOne === (bookOne || bookTwo) &&
        userMatch.bookTwo === (bookOne || bookTwo)
      )
        console.log('books already matched');
      return true;
    }
    return false;
  };

  try {
    const createMatch = async (data) => {
      let newMatch = await Match.create(data);
      let match = await Match.findOne(newMatch._id)
        .populate('bookOne')
        .populate('bookTwo');

      await User.findByIdAndUpdate(match.bookOne.owner, {
        $push: { matches: match._id },
      });
      await User.findByIdAndUpdate(match.bookTwo.owner, {
        $push: { matches: match._id },
      });

      res.json(newMatch);
    };

    if (user.matches.length < 1) {
      console.log('this runs');
      createMatch(req.body);
    } else {
      // check if matches contain these books already = true/false

      console.log('does match exist?', checkIfMatchExists());

      if (checkIfMatchExists()) {
        next(customError(`Books already matched`, 400));
        return;
      } else {
        createMatch(req.body);
      }
    }
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
