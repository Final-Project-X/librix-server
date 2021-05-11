const User = require('../models/User');
const mongoose = require('mongoose');
const customError = require('../helpers/customErrorHandler');

exports.getUsers = async (req, res) => {
  let users = await User.find();
  res.json(users);
};

exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    let user = await User.findById(id);
    // id is a valid mongoose id
    if (!user) {
      next(customError(`User with ID: ${id} does not exist`, 400));
    }
    res.json(user);
  } catch (err) {
    // id is not a valid mongoose id
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  // todo : check the req.body to see if the information is good and there is a change
  const { id } = req.params;

  try {
    let user = await User.findById(id);
    if (!user) {
      next(customError(`User with ID: ${id} does not exist`, 400));
      return;
    }
    Object.assign(user, req.body);
    const userUpdated = await user.save();
    res.json(userUpdated);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    next(err);
  }
};

//method for signing up the user
exports.addUser = async (req, res, next) => {
  // todo : check req.body is the right information
  const userData = req.body;

  try {
    let user = new User(userData);
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    let userDeleted = await User.findByIdAndDelete(id);
    if (!userDeleted) {
      next(customError(`User with ID: ${id} does not exist`, 400));
      return;
    }
    res.json(userDeleted);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  // todo : rewrite this login when more functionality is available
  const { email } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      next(customError(`User with email: ${email} does not exist`, 400));
      return;
    }
    res.json(userFound);
  } catch (err) {
    next(err);
  }
};
