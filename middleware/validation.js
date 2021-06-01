const { body, validationResult } = require('express-validator');
const customError = require('../helpers/customErrorHandler');

exports.validateBook = (req, res, next) => {
  //for checking
  console.log(
    'This comes from the custom book validation middleware',
    req.body
  );
  const book = req.body;

  if (book.authors) {
    let cleanAuthors = book.authors.map((name) => {
      let sanitize = name.split(' ');
      let clean = sanitize.map((word) =>
        word[0].toUpperCase().concat(word.substring(1))
      );
      name = clean.join(' ');
      return name;
    });
    book.authors = cleanAuthors;
  }

  if (
    book.title &&
    book.owner &&
    book.authors &&
    book.publishedDate &&
    book.city &&
    book.language &&
    book.genre &&
    book.condition &&
    book.selectedFiles
  ) {
    next();
  } else {
    return next(
      customError(
        `Your book has missing information mate, please check the data again.`,
        400
      )
    );
  }
};

// check user information before adding
exports.userValidationRules = () => {
  return [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Your email address is not valid')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password to small')
      .custom((value) => {
        const regex = new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
        );
        const res = regex.test(value);
        return res;
      })
      .withMessage('Password not strong enough'),
    body('username').trim(),
  ];
};

exports.userValidationErrorHandling = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  next(customError(errors.errors[0].msg, 422));
};
