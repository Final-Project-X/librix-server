const customError = require('../helpers/customErrorHandler');
const customResponse = require('../helpers/customResponseHandler');
const User = require('../models/User');
const Book = require('../models/Book');

exports.isMatch = async (req, res, next) => {
  const { bookId } = req.body;
  const { id } = req.params;
  const matchBooks = [];

  try {
    const user = await User.findById(id).populate('matches');

    if (!user) {
      return next(customError(`User with ID: ${id} does not exist`, 400));
    }

    // find and populate the owner of the book
    const checkBookOwner = await Book.findById(bookId).populate('owner');
    if (!checkBookOwner) {
      return next(customError(`Book with ${id} does not exist`));
    }

    if (!checkBookOwner.owner === null) {
      return next(customError(`something went wrong, please try again`));
    }

    const findBooksToMatch = checkBookOwner.owner.booksInterestedIn.map(
      (item) => item._id
    );

    for (item of findBooksToMatch) {
      let approve = true;

      let bookTwo = await Book.findById(item);

      if (!bookTwo) {
        approve = false;
      }

      if (bookTwo.owner.toString() !== user._id.toString()) {
        approve = false;
      }

      // check if user owns one book and is interested in one book
      const userIsInterestedInBook = user.booksInterestedIn.includes(bookId);
      const userOffersBook = user.booksToOffer.includes(bookTwo._id);

      if (!userIsInterestedInBook || !userOffersBook) {
        approve = false;
      }

      if (user.matches.length > 0) {
        const checkIfMatchExists = (data) => {
          if (
            (data.bookOne.toString() === bookId.toString() ||
              data.bookOne.toString() === bookTwo._id.toString()) &&
            (data.bookTwo.toString() === bookId.toString() ||
              data.bookTwo.toString() === bookTwo._id.toString())
          ) {
            return true;
          } else return false;
        };

        for (userMatch of user.matches) {
          const doesExist = checkIfMatchExists(userMatch);
          if (doesExist) {
            approve = false;
          }
        }
      }
      // if approve has not been changed to false, add this book to matchBooks array
      if (approve) {
        matchBooks.push(bookTwo);
      }
    }

    if (matchBooks.length < 1)
      return res.json(
        customResponse(
          '💔 no match. Added user to interested user but no match created.'
        )
      );

    const bookOne = bookId;
    req.body = { bookOne, matchBooks };
    next();
  } catch (err) {
    next(err);
  }
};
