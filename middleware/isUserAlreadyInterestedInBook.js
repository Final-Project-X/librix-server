const customError = require('../helpers/customErrorHandler');
const customResponse = require('../helpers/customResponseHandler');
const Book = require('../models/Book');
const User = require('../models/User');

exports.isUserAlreadyInterestedInBook = async (req, res, next) => {
  const { id } = req.params;
  const { bookId } = req.body;

  try {
    if (!id || !bookId) {
      return next(customError('A user ID and a book ID must be provided', 400));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(customError('There is no user with that id', 400));
    }

    const book = await Book.findById(bookId);
    if (!book) {
      // if we get here from saved books, we must remove the book from the saved books library
      if (user.booksToRemember.includes(bookId)) {
        await User.findByIdAndUpdate(id, {
          $pull: { booksToRemember: bookId },
        });

        return res.json(
          customResponse(
            'This book has likely been deleted, unfortunatley we must remove this book from your saved books and you can no longer make a match with this book.'
          )
        );
      }
      return next(customError('There is no book with that id', 400));
    }

    if (book.interestedUsers.includes(id)) {
      return next(
        customError('This user is already interested in this book', 400)
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};
//};
