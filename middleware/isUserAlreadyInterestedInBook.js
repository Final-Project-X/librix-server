const customError = require('../helpers/customErrorHandler');
const Book = require('../models/Book');

exports.isUserAlreadyInterestedInBook = async (req, res, next) => {
  const { id } = req.params;
  const { bookId } = req.body;

  try {
    if (!id || !bookId) {
      return next(customError('A user ID and a book ID must be provided', 400));
    }

    const book = await Book.findById(bookId);
    if (!book) {
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
