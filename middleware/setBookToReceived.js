const customError = require('../helpers/customErrorHandler');
const Match = require('../models/Match');
const mongoose = require('mongoose');

exports.setBookToReceived = async (req, res, next) => {
  const { matchId, matchBookId } = req.body;

  try {
    let match = await Match.findById(matchId);

    if (!match) {
      return next(customError(`Match with ID: ${matchId} does not exist`, 400));
    }

    if (match.bookOne.toString() === matchBookId.toString()) {
      match = await Match.findByIdAndUpdate(
        matchId,
        {
          bookOneStatus: 'received',
        },
        { new: true }
      );

      console.log(`set Status of book One to: ${match.bookOneStatus}`);
    }

    if (match.bookTwo.toString() === matchBookId.toString()) {
      match = await Match.findByIdAndUpdate(
        matchId,
        {
          bookTwoStatus: 'received',
        },
        { new: true }
      );

      console.log(`set Status of book Two to: ${match.bookTwoStatus}`);
    }

    req.body = { match };
    next();
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${matchId} is not valid`, 400));
    }
    next(err);
  }
};
