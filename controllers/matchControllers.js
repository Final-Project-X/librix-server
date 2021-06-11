const Match = require('../models/Match');
const User = require('../models/User');
const Book = require('../models/Book');
const customError = require('../helpers/customErrorHandler');
const customResponse = require('../helpers/customResponseHandler');
const mongoose = require('mongoose');

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

    res.json(customResponse(`You got ${matchesArray.length} matches`));
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
      return next(customError(`Match with ID: ${id} does not exist`, 400));
    }

    Object.assign(match, req.body);
    const updatedMatch = await match.save();

    res.json(updatedMatch);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    next(err);
  }
};

exports.deleteMatch = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body;

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

    // delete user from interestedUser in book
    if (bookOne.owner.toString() === userId.toString()) {
      await Book.findByIdAndUpdate(bookTwo._id, {
        $pull: { interestedUsers: userId },
      });
    } else {
      await Book.findByIdAndUpdate(bookOne._id, {
        $pull: { interestedUsers: userId },
      });
    }

    await match.delete();

    res.json(match);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    next(err);
  }
};

exports.updateBookAndMatchStatus = async (req, res, next) => {
  const { id } = req.params;
  const { bookId } = req.body;
  if (!id || !bookId)
    return next(customError('User id and book id must be provided.', 400));

  try {
    await Book.findByIdAndUpdate(bookId, {
      reserved: true,
    });

    const match = await Match.findById(id);
    if (!match) {
      return next(customError(`Match with ID: ${id} does not exist`, 400));
    }

    if (match.bookOne.toString() === bookId.toString()) {
      await Match.findByIdAndUpdate(id, {
        bookOneStatus: 'reserved',
      });
      return res.json(customResponse('Book one status updated'));
    }

    if (match.bookTwo.toString() === bookId.toString()) {
      await Match.findByIdAndUpdate(id, {
        bookTwoStatus: 'reserved',
      });
      return res.json(customResponse('Book two status updated'));
    }

    res.json(customError('Book Id is not valid for this match.', 400));
  } catch (err) {
    next(err);
  }
};

//delete all after status is exchanged
exports.deleteAfterExchange = async (req, res, next) => {
  const { match } = req.body;
  if (!match) {
    return next(
      customError(
        `deleteController: Match with ID: ${matchId} does not exist`,
        400
      )
    );
  }

  try {
    if (
      match.bookOneStatus !== 'received' ||
      match.bookTwoStatus !== 'received'
    ) {
      return res.json(
        customResponse(
          `Just one of the books is set to 'received'. Both need to have these status before deleting the data.`
        )
      );
    }

    //get Books
    const bookOne = await Book.findById(match.bookOne);
    const bookTwo = await Book.findById(match.bookTwo);
    if (!bookOne || !bookTwo) {
      return next(customError(`one or both of the book do not exist`, 400));
    }

    // get users
    const userOne = await User.findById(bookOne.owner).populate('matches');
    const userTwo = await User.findById(bookTwo.owner).populate('matches');

    // get all other matches with this books
    const matchesWithBookOne = userOne.matches.filter(
      (data) =>
        data.bookOne.toString() === bookOne._id.toString() ||
        data.bookTwo.toString() === bookOne._id.toString()
    );

    const matchesWithBookTwo = userTwo.matches.filter(
      (data) =>
        data.bookOne.toString() === bookTwo._id.toString() ||
        data.bookTwo.toString() === bookTwo._id.toString()
    );

    // combine and unify the matches
    let allMatches = [...matchesWithBookOne, ...matchesWithBookTwo];
    let allMatchesToId = allMatches.map((item) => item._id.toString());
    let matchesWithBooks = [...new Set(allMatchesToId)];

    // delete only matches where the books are in
    if (matchesWithBooks.length == 0) {
      return;
    }

    for (let i = 0; i < matchesWithBooks.length; i++) {
      let matchToDelete = await Match.findById(matchesWithBooks[i])
        .populate('bookOne')
        .populate('bookTwo');

      await User.findByIdAndUpdate(matchToDelete.bookOne.owner, {
        $pull: { matches: matchToDelete._id },
      });
      await User.findByIdAndUpdate(matchToDelete.bookTwo.owner, {
        $pull: { matches: matchToDelete._id },
      });

      await matchToDelete.delete();
    }

    await match.delete();

    // Take book out of all users who are interested in the book
    bookOne.interestedUsers.map(
      async (user) =>
        await User.findByIdAndUpdate(user, {
          $pull: { booksInterestedIn: bookOne._id },
        })
    );

    bookTwo.interestedUsers.map(
      async (user) =>
        await User.findByIdAndUpdate(user, {
          $pull: { booksInterestedIn: bookTwo._id },
        })
    );

    //take interested users out of the books
    await Book.findByIdAndUpdate(bookOne._id, {
      $pull: { interestedUsers: userTwo._id },
    });

    await Book.findByIdAndUpdate(bookTwo._id, {
      $pull: { interestedUsers: userOne._id },
    });

    // delete books in booksToOffer in  users
    await User.findByIdAndUpdate(userOne._id, {
      $pull: { booksToOffer: bookOne._id },
    });

    await User.findByIdAndUpdate(userTwo._id, {
      $pull: { booksToOffer: bookTwo._id },
    });

    // delete books
    await bookOne.delete();
    await bookTwo.delete();

    res.json(customResponse(`Both Books with all connections are deleted.`));
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    next(err);
  }
};
