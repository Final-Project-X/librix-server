const customError = require('../helpers/customErrorHandler');
const Book = require('../models/Book');

exports.isUserAlreadyInterestedInBook = async (req, res, next) => {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return next(customError('A user ID and a book ID must be provided', 400));
  }

  const book = await Book.findById(bookId);
  const user = await User.findById(userId);

  if (!user) {
    return next(customError(`User with id: ${userId} does not exists`));
  }

  if (!book) {
    return next(customError(`Book with id: ${bookId} does not exists`));
  }

  const interestedUserArray = book.interestedUsers.filter(
    (id) => id.toString() === userId.toString()
  );

  const interestedBookArray = user.booksInterestedIn.filter(
    (id) => id.toString() === bookId.toString()
  );

  if (interestedUserArray.length > 0 || interestedBookArray.length > 0) {
    return next(
      customError('This user is already interested in this book', 400)
    );
  }

  next();
};
