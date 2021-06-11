const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MatchSchema = new Schema(
  {
    bookOne: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    bookOneStatus: { type: String, default: 'pending' }, // pending /reserved / received
    bookTwo: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    bookTwoStatus: { type: String, default: 'pending' }, // pending /reserved / received
    chat: [
      {
        sender: { type: Schema.Types.ObjectId, ref: 'User' },
        message: {
          type: String,
          required: false,
        },
        timeSent: { type: Date, required: false },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Match = model('Match', MatchSchema);

module.exports = Match;
