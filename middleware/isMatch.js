const customError = require('../helpers/customErrorHandler');
const User = require('../models/User');
const Book = require('../models/Book');

exports.isMatch = async (req, res, next) => {
  const { bookId } = req.body;
  const { id } = req.params;
  const matchBooks = [];

  try {
    const user = await User.findById(id).populate('matches'); // chrissi

    if (!user) {
      return next(customError(`User with ID: ${id} does not exist`, 400));
    }

    //check if bookOneId.owner(luke ) is in user.booksToOffer.interestedUsers (chrissis books)
    const checkBookOwner = await Book.findById(bookId).populate('owner');
    const findBooksToMatch = checkBookOwner.owner.booksInterestedIn.map(
      (item) => item._id
    );
    console.log(`findBooksToMatch, ${findBooksToMatch.length}`);
    let approve = true;

    for (item of findBooksToMatch) {
      console.log('we start the loop again!');

      let bookTwo = await Book.findById(item);

      if (!bookTwo) {
        approve = false;
        console.log('No BookTwo. Added interested user but no match created.');
      }

      if (bookTwo.owner.toString() !== user._id.toString()) {
        approve = false;
        console.log(
          'UserId is not bookTwoOwner, so  💔 no match, but added interested user but no match created.'
        );
      }

      // check if user owns one book and is interested in one book
      const userIsInterestedInBook = user.booksInterestedIn.includes(bookId);
      const userOffersBook = user.booksToOffer.includes(bookTwo._id);
      console.log(userIsInterestedInBook, userOffersBook);

      if (!userIsInterestedInBook || !userOffersBook) {
        approve = false;
        console.log(
          '💔 no match: logic is not right. But=> Added interested user but no match created.'
        );
      }

      const checkIfMatchExists = (data) => {
        if (
          (data.bookOne.toString() === bookId ||
            data.bookOne.toString() === bookTwo._id.toString()) &&
          (data.bookTwo.toString() === bookId ||
            data.bookTwo.toString() === bookTwo._id.toString())
        ) {
          console.log('books already matched');
          return true;
        } else return false;
      };

      for (userMatch of user.matches) {
        const doesExist = checkIfMatchExists(userMatch);
        console.log('doesExist', doesExist);
        if (doesExist) {
          approve = false;
          console.log(
            '💔  match exists. Added interested user but no match created.'
          );
        }
      }

      console.log('this is approve', approve);
      if (approve) {
        matchBooks.push(bookTwo);
        console.log('📖 thats a 💖 MATCH');
      }
    }

    console.log('matchbooks:', matchBooks);
    if (matchBooks.length < 1)
      return res.json(
        '💔 no match. Added user to interested user but no match created.'
      );

    const bookOne = bookId;
    req.body = { bookOne, matchBooks };
    next();
  } catch (err) {
    next(err);
  }
};
