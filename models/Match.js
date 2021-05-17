const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const MatchSchema = new Schema(
  {

    bookOne: {

      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },

    bookTwo: {

      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
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
    status: { type: String, required: true, default: 'pending' }, // pending / exchanged / rejected
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Match = model('Match', MatchSchema);

module.exports = Match;

//create a possible match
// check booksToOffer of interested users , if they have the book owner as interested user itself
//with find match function but logic like
//* if (book.owner === book.interestedUsers[j].booksToOffer.map((book) =>
//*     book.interestedUsers.find(owner)
//*   )
//OR
// * let exchangeBook = user.booksToOffer.map((item) => item.interestedUsers.find(book.owner));
