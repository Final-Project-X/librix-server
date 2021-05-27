const User = require('../models/User');
const Book = require('../models/Book');
const Match = require('../models/Match');
const mongoose = require('mongoose');
const customError = require('../helpers/customErrorHandler');
const customResponse = require('../helpers/customResponseHandler');

exports.getUsers = async (req, res) => {
  let users = await User.find();
  res.json(users);
};

exports.getUser = async (req, res, next) => {
  const { id } = req.body; // matchPartnerId
  try {
    let user = await User.findById(id);
    // id is a valid mongoose id
    if (!user) {
      return next(customError(`User with ID: ${id} does not exist`, 400));
    }
    const { username, aboutMe, city, avatar, points } = user;
    res.json({ username, aboutMe, city, avatar, points });
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
    let user = await User.findById(id)
      .populate('booksToOffer')
      .populate('booksToRemember')
      .populate('booksInterestedIn')
      .populate('matches');

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

// delete user and all data an connections with hin
exports.deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    let userToDelete = await User.findById(id)
      .populate('booksToOffer')
      .populate('matches')
      .populate('booksInterestedIn');

    if (!userToDelete) {
      return next(customError(`User with ID: ${id} does not exist`, 400));
    }

    // if no matches just delete books and connections
    if (userToDelete.matches.length < 1) {
      await Book.deleteMany({ owner: userToDelete._id });

      await Book.updateMany(
        { _id: userToDelete.booksInterestedIn },
        {
          $pull: { interestedUsers: userToDelete._id },
        }
      );

      await userToDelete.delete();
      res.json(
        customResponse(
          `User ${userToDelete.username} is deleted`,
          'confirmation'
        )
      );
    }

    // if matches delete matches first in both users and itself
    for (let i = 0; i < userToDelete.matches.length; i++) {
      const match = await Match.findById(userToDelete.matches[i])
        .populate('bookOne')
        .populate('bookTwo');

      if (!match) {
        return next(
          customError(
            `Match with ID: ${userToDelete.matches[i]} does not exist`,
            400
          )
        );
      }

      await User.findByIdAndUpdate(match.bookOne.owner, {
        $pull: { matches: match._id },
      });
      await User.findByIdAndUpdate(match.bookTwo.owner, {
        $pull: { matches: match._id },
      });

      await match.delete();
    }

    // delete Users Books
    await Book.deleteMany({ owner: userToDelete._id });

    await Book.updateMany(
      { _id: userToDelete.booksInterestedIn },
      {
        $pull: { interestedUsers: userToDelete._id },
      }
    );

    await userToDelete.delete();
    res.json(
      customResponse(`User ${userToDelete.username} is deleted`, 'confirmation')
    );
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(customError(`ID: ${id} is not valid`, 400));
    }
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email })
      .populate('booksToOffer')
      .populate('booksToRemember')
      .populate('booksInterestedIn')
      .populate('matches');

    if (!user) {
      return next(customError('User with given email not found!', 400));
    }

    let pwMatch = user.password === password;

    if (!pwMatch) {
      return next(customError('Passwords do not match', 400));
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

//--------------------------------------------------------
// nee to be checked after deploy, auth and set cookies
exports.logoutUser = async (req, res, next) => {
  res.clearCookie('token', {
    sameSite: process.env.NODE_ENV == 'production' ? 'None' : 'lax',
    secure: process.env.NODE_ENV == 'production' ? true : false, //http on localhost, https on production
    httpOnly: true,
  }); // clear the cookie in the browser
  res.json(customResponse(`Logged out successfully!`, 'confirmation'));
};
