const User = require("../models/User");
//const bcryptjs = require("bcryptjs");

/**
 * things to think about
 * how we grab users : through req.body or req.params
 *
 */

exports.getUsers = async (req, res) => {
  let users = await User.find();
  res.json(users);
};

exports.getUser = async (req, res, next) => {
  // Grab the id from the url
  const { id } = req.params;
  // Find the user with that id
  try {
    let user = await User.findById(id);
    res.json(user);
  } catch (err) {
    //todo : are we making custom errors?
    next(err); // found error of not found todo
  }
};

exports.updateUser = async (req, res) => {
  // Grab the id from the url
  const { id } = req.params;
  // todo : do we have a middle ware to check the req.body to see if the information is good or allowed?
  try {
    let user = await User.findById(id); // update the user fields
    Object.assign(user, req.body);
    const userUpdated = await user.save(); // => this will trigger the pre save hook
    res.json(userUpdated);
  } catch (err) {
    next(err);
  }
};

//method for signing up the user
exports.addUser = async (req, res, next) => {
  const userData = req.body;
  try {
    // overwrite password with password hash
    //userData.password = bcryptjs.hashSync(userData.password);

    // create the user and grab the user id
    let user = new User(userData);
    // todo : set up the generate methods
    // generate a token
    const token = user.generateAuthToken();
    // generate an email verification token

    //todo : do we want email verification?
    //const verifToken = user.generateEmailVerifToken();
    // send an email verification email
    //user.emailVerificationToken = verifToken;
    await user.save();
    //sendVerificationEmail(user);

    // put the token in the response
    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 6048000),
        secure: false, // http
        httpOnly: true,
      })
      .json(user);
  } catch (err) {
    next(err); // forward error to central error handler
  }
};

exports.deleteUser = async (req, res, next) => {
  //Grab the id from the url
  const { id } = req.params;
  try {
    let userDeleted = await User.findByIdAndDelete(id);
    if (!userDeleted) throw new Error();
    res.json(userDeleted);
  } catch (err) {
    let error = new Error(`User with Id ${id} does not exist`);
    error.status = 400;
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email.find()) {
      //todo : possibly find better solution
      return;
    }

    // generate a token
    //const token = user.generateAuthToken();

    // put the token in the response
    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 6048000),
        secure: false, // http
        httpOnly: true,
      })
      .json(user);
  } catch (err) {
    next(err);
  }
};
