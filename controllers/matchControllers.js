const Match = require('../models/Match');
const User = require('../models/User');
const customError = require('../helpers/customErrorHandler');
const customResponse = require('../helpers/customResponseHandler');
const mongoose = require('mongoose');
const Book = require('../models/Book');

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

//delete all after status is exchanged
exports.deleteAfterExchange = async (req, res, next) => {
  const { id } = req.body;

  try {
    const match = await Match.findById(id);

    if (!match) {
      return next(customError(`Match with ID: ${id} does not exist`, 400));
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

    // console.log('matchesWitchBooks', matchesWithBookOne, matchesWithBookTwo);

    // delete all matches where the books are in
    const deleteAllMatchesWithBook = async (matchesWithBook) => {
      if (matchesWithBook.length === 0) {
        return console.log('there are no matches with these book');
      } else {
        for (let i = 0; i < matchesWithBook.length; i++) {
          let matchToDelete = await Match.findById(matchesWithBook[i])
            .populate('bookOne')
            .populate('bookTwo');

          console.log(matchToDelete);

          await User.findByIdAndUpdate(matchToDelete.bookOne.owner, {
            $pull: { matches: matchToDelete._id },
          });
          await User.findByIdAndUpdate(matchToDelete.bookTwo.owner, {
            $pull: { matches: matchToDelete._id },
          });
          await matchToDelete.delete();
          console.log('deleted match ', matchToDelete._id);
        }

        return console.log(`deleted ${matchesWithBook.length} Matches`);
      }
    };

    deleteAllMatchesWithBook(matchesWithBookOne);
    deleteAllMatchesWithBook(matchesWithBookTwo);

    // Take book out of all user which are interested in book
    bookOne.interestedUsers.map(
      async (user) =>
        await User.findByIdAndUpdate(user, {
          $pull: { booksInterestedIn: bookOne._id },
        })
    );

    bookOne.update({
      $pull: { interestedUsers: userTwo._id },
    });

    bookTwo.interestedUsers.map(
      async (user) =>
        await User.findByIdAndUpdate(user, {
          $pull: { booksInterestedIn: bookTwo._id },
        })
    );

    bookTwo.update({
      $pull: { interestedUsers: userOne._id },
    });

    // delete books in booksToOffer in  users
    userOne.update({
      $pull: { booksToOffer: bookOne._id },
    });

    userTwo.update({
      $pull: { booksToOffer: bookTwo._id },
    });

    // delete books
    bookOne.delete();
    bookTwo.delete();
    res.json(customResponse(`Both Books with all connections are deleted.`));
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    next(err);
  }
};
