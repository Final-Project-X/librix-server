const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MatchSchema = new Schema(
  {
    BooksToChange: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    BookToChange: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
    BookToReceive: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
    },
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
    status: { type: String, required: true }, // pending / exchanged / rejected
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Match = model('Match', MatchSchema);

module.exports = Match;
