const customError = require('../helpers/customErrorHandler');
const Book = require('../models/Book');

exports.isUserAlreadyInterestedInBook = async (req, res, next) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return next(customError('A user ID and a book ID must be provided', 400));
  }

  const book = await Book.findById(bookId);

  const interestedUserArray = book.interestedUsers.filter(
    (id) => id.toString() === userId.toString()
  );

  if (interestedUserArray.length > 0) {
    return next(
      customError('This user is already interested in this book', 400)
    );
  }

  next();
};
