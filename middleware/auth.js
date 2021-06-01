const User = require('../models/User');
const customError = require('../helpers/customErrorHandler');

exports.auth = async (req, res, next) => {
  const token = req.headers.auth;

  if (!token) {
    return next(customError('No token provided', 400));
  }

  try {
    const user = User.verifyToken(token);
    req.user = user; // store detected user in request, so routes can use user information
    next();
  } catch (err) {
    next(err);
  }
};
