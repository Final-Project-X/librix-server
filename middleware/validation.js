const { body, validationResult } = require('express-validator');
const customError = require('../helpers/customErrorHandler');

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
