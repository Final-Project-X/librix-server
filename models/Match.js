const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MatchSchema = new Schema(
  {
    //? how do you tell which is user is book to change and which user is book to recieve?
    //? should we make an array with two objects containing a user and book ref?
    bookToChange: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    bookToReceive: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    booksToChange: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    chat: [
      {
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
        message: {
          type: String,
          required: true,
        },
        timeSent: { type: Date, required: true },
      },
    ],
    status: { type: String, required: true, default: 'pending' }, // pending / exchanged / rejected
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Match = model('Match', MatchSchema);

module.exports = Match;
