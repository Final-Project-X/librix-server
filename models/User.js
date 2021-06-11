const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const UserSchema = new Schema(
  {
    // general user information
    username: { type: String, required: true },
    aboutMe: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false, default: '/statics/01.png' },
    city: { type: String, required: true },
    points: { type: Number, default: 0 },
    // a library of our books
    booksToOffer: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    // a list of saved books
    booksToRemember: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    // a list of books we have swiped
    booksInterestedIn: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    matches: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Match',
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      transform: (docOriginal, docToReturn) => {
        delete docToReturn.password; // hide password field in all res.json outputs
      },
    },
  }
);

UserSchema.methods.hashPassword = function () {
  const user = this;
  if (user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password, 10);
  }
};

UserSchema.methods.comparePasswords = function (pwPlain) {
  const user = this;
  return bcrypt.compareSync(pwPlain, user.password);
};

UserSchema.methods.generateToken = function () {
  const user = this;
  const payload = { _id: user._id };
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '5h',
  });

  return token;
};

UserSchema.statics.verifyToken = function (token) {
  return jwt.verify(token, JWT_SECRET);
};

UserSchema.statics.findByToken = function (token) {
  const User = this;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return;
  }

  return User.findById(payload._id);
};

const User = model('User', UserSchema);

module.exports = User;
