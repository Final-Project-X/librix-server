const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
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
        delete docToReturn.password; // hide password field in all res.json outputs...
      },
    },
  }
);

const User = model('User', UserSchema);

module.exports = User;

//* MATCH
// booksInterestedIn.owner === user.booksToOffer.interestedUsers => add new match
